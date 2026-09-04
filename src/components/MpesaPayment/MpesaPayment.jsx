import { useEffect, useRef, useState } from "react";
import { Smartphone, CheckCircle2, XCircle } from "lucide-react";
import { apiInitiateSTKPush, apiGetPaymentStatus } from "../../api";
import "./MpesaPayment.css";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 90000; // STK prompts expire on the phone after ~60s

/** Accepts 07.., 7.., 01.., 254.., or +254.. and normalizes to 2547XXXXXXXX. */
function normalizeKenyanPhone(input) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}

function isValidKenyanPhone(normalized) {
  return /^254(7|1)\d{8}$/.test(normalized);
}

/**
 * M-Pesa STK Push payment flow for a placed order. Self-contained: collects
 * a phone number, initiates the push, then polls for the async result
 * (Safaricom's callback lands on the backend independently of this request).
 */
function MpesaPayment({ orderId, amount }) {
  const [phase, setPhase] = useState("idle"); // idle | entering | pushing | polling | success | failed | timeout
  const [phoneInput, setPhoneInput] = useState("");
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const pollTimer = useRef(null);
  const pollDeadline = useRef(null);

  useEffect(() => {
    return () => clearTimeout(pollTimer.current);
  }, []);

  const startPolling = (paymentId) => {
    pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;

    const poll = async () => {
      try {
        const data = await apiGetPaymentStatus(paymentId);
        if (data.payment.status === "completed") {
          setPayment(data.payment);
          setPhase("success");
          return;
        }
        if (data.payment.status === "failed") {
          setPayment(data.payment);
          setPhase("failed");
          setError("Payment was not completed.");
          return;
        }
      } catch {
        // Transient — keep polling until the deadline.
      }

      if (Date.now() >= pollDeadline.current) {
        setPhase("timeout");
        return;
      }
      pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
    };

    pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    const normalized = normalizeKenyanPhone(phoneInput);
    if (!isValidKenyanPhone(normalized)) {
      setError("Enter a valid Safaricom number, e.g. 0712 345 678");
      return;
    }

    setError(null);
    setPhase("pushing");
    try {
      const data = await apiInitiateSTKPush({
        orderId,
        phoneNumber: normalized,
      });
      setPayment(data.payment);
      setPhase("polling");
      startPolling(data.payment.id);
    } catch (err) {
      setError(err.message);
      setPhase("failed");
    }
  };

  const handleRetry = () => {
    clearTimeout(pollTimer.current);
    setPayment(null);
    setError(null);
    setPhase("entering");
  };

  if (phase === "idle") {
    return (
      <button
        type="button"
        className="mpesa-trigger"
        onClick={() => setPhase("entering")}
      >
        <Smartphone size={16} />
        Pay with M-Pesa
      </button>
    );
  }

  if (phase === "entering" || phase === "pushing") {
    return (
      <form className="mpesa-panel" onSubmit={handleSendRequest}>
        <label className="mpesa-label" htmlFor="mpesa-phone">
          M-Pesa phone number
        </label>
        <input
          id="mpesa-phone"
          className="mpesa-input"
          type="tel"
          inputMode="tel"
          placeholder="0712 345 678"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          disabled={phase === "pushing"}
          autoFocus
        />
        {error && <p className="mpesa-error">{error}</p>}
        <button
          type="submit"
          className="mpesa-submit"
          disabled={phase === "pushing"}
        >
          {phase === "pushing" ? (
            <span className="mpesa-spinner" />
          ) : (
            `Pay KSh ${amount.toLocaleString()}`
          )}
        </button>
      </form>
    );
  }

  if (phase === "polling") {
    return (
      <div className="mpesa-panel mpesa-panel--status">
        <span className="mpesa-spinner mpesa-spinner--lg" />
        <p className="mpesa-status-title">Check your phone</p>
        <p className="mpesa-status-text">
          Enter your M-Pesa PIN on the prompt sent to{" "}
          {payment?.phone_number} to complete this payment.
        </p>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="mpesa-panel mpesa-panel--status">
        <CheckCircle2 size={28} className="mpesa-icon mpesa-icon--success" />
        <p className="mpesa-status-title">Payment received</p>
        {payment?.mpesa_receipt_number && (
          <p className="mpesa-status-text">
            M-Pesa receipt: <strong>{payment.mpesa_receipt_number}</strong>
          </p>
        )}
      </div>
    );
  }

  if (phase === "timeout") {
    return (
      <div className="mpesa-panel mpesa-panel--status">
        <p className="mpesa-status-title">Still waiting</p>
        <p className="mpesa-status-text">
          This is taking longer than usual. If you entered your PIN, it may
          still go through — check your M-Pesa messages, or try again.
        </p>
        <button type="button" className="mpesa-submit" onClick={handleRetry}>
          Try Again
        </button>
      </div>
    );
  }

  // failed
  return (
    <div className="mpesa-panel mpesa-panel--status">
      <XCircle size={28} className="mpesa-icon mpesa-icon--failed" />
      <p className="mpesa-status-title">Payment failed</p>
      {error && <p className="mpesa-status-text">{error}</p>}
      <button type="button" className="mpesa-submit" onClick={handleRetry}>
        Try Again
      </button>
    </div>
  );
}

export default MpesaPayment;
