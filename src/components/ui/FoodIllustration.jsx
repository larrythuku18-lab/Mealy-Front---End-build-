/**
 * FoodIllustration – Generates a food-themed SVG illustration based on the
 * meal's name and description. Falls back to a generic plate when the food
 * type can't be determined.
 *
 * Keywords are matched case-insensitively against the combined name + description.
 */

const FOOD_PALETTES = {
  rice: { bg: "#fef3c7", accent: "#f59e0b", detail: "#d97706", garnish: "#65a30d" },
  meat: { bg: "#fef2f2", accent: "#dc2626", detail: "#991b1b", garnish: "#fbbf24" },
  chicken: { bg: "#fffbeb", accent: "#f59e0b", detail: "#b45309", garnish: "#65a30d" },
  fish: { bg: "#eff6ff", accent: "#3b82f6", detail: "#1d4ed8", garnish: "#fbbf24" },
  soup: { bg: "#fef3c7", accent: "#ea580c", detail: "#c2410c", garnish: "#65a30d" },
  vegetable: { bg: "#f0fdf4", accent: "#22c55e", detail: "#15803d", garnish: "#f59e0b" },
  salad: { bg: "#ecfdf5", accent: "#10b981", detail: "#059669", garnish: "#f97316" },
  bread: { bg: "#fefce8", accent: "#ca8a04", detail: "#a16207", garnish: "#16a34a" },
  pasta: { bg: "#fefce8", accent: "#eab308", detail: "#ca8a04", garnish: "#ef4444" },
  ugali: { bg: "#f5f5f4", accent: "#d6d3d1", detail: "#a8a29e", garnish: "#65a30d" },
  dessert: { bg: "#fdf2f8", accent: "#ec4899", detail: "#be185d", garnish: "#fbbf24" },
  drink: { bg: "#fef9c3", accent: "#f97316", detail: "#ea580c", garnish: "#84cc16" },
  fruit: { bg: "#fef3c7", accent: "#f97316", detail: "#dc2626", garnish: "#65a30d" },
  stew: { bg: "#fef2f2", accent: "#ea580c", detail: "#c2410c", garnish: "#fbbf24" },
};

const DEFAULT_PALETTE = { bg: "#f5f5f4", accent: "#78716c", detail: "#57534e", garnish: "#a8a29e" };

function detectFoodType(name, description) {
  const text = `${name || ""} ${description || ""}`.toLowerCase();

  if (/\b(jollof|pilau|biryani|fried rice|plain rice|rice)\b/.test(text)) return "rice";
  if (/\b(beef|goat|lamb|mutton|nyama|steak|kebab|tikka)\b/.test(text)) return "meat";
  if (/\b(chicken|murgi|kuku|wing|thigh|breast)\b/.test(text)) return "chicken";
  if (/\b(fish|samaki|salmon|tilapia|trout|prawn|shrimp)\b/.test(text)) return "fish";
  if (/\b(soup|broth|consommé)\b/.test(text)) return "soup";
  if (/\b(stew|curry|masala)\b/.test(text)) return "stew";
  if (/\b(salad|greens|kachumbari|coleslaw)\b/.test(text)) return "salad";
  if (/\b(vegetable|veggie|sukuma|managu|spinach|cabbage|broccoli)\b/.test(text)) return "vegetable";
  if (/\b(bread|chapati|roti|naan|mandazi|scone)\b/.test(text)) return "bread";
  if (/\b(pasta|spaghetti|noodle|macaroni|penne)\b/.test(text)) return "pasta";
  if (/\b(ugali|nsima|sadza|posho|fufu)\b/.test(text)) return "ugali";
  if (/\b(cake|pie|pastry|pudding|ice cream|mousse|sweet|dessert|tiramisu|brownie)\b/.test(text)) return "dessert";
  if (/\b(juice|smoothie|tea|coffee|soda|drink|lassi|lassi|water|beverage)\b/.test(text)) return "drink";
  if (/\b(fruit|apple|banana|mango|orange|berry)\b/.test(text)) return "fruit";
  return null;
}

/* ── SVG Illustrations per food type ──────────────────────────────────────── */

function RiceIllustration({ palette }) {
  return (
    <g>
      {/* Bowl */}
      <ellipse cx="200" cy="210" rx="130" ry="60" fill={palette.detail} opacity="0.15" />
      <ellipse cx="200" cy="200" rx="120" ry="55" fill="#fff" />
      <ellipse cx="200" cy="195" rx="115" ry="50" fill={palette.bg} />
      {/* Rice mound */}
      <ellipse cx="200" cy="190" rx="100" ry="40" fill="#fffbeb" />
      <ellipse cx="200" cy="185" rx="90" ry="35" fill="#fef9c3" />
      {/* Rice grains */}
      {[...Array(18)].map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const seed = (i * 7 + 3) % 17;
        const r = 40 + (seed / 17) * 35;
        const x = 200 + Math.cos(angle) * r;
        const y = 188 + Math.sin(angle) * (r * 0.45);
        const rotSeed = (i * 13 + 5) % 60;
        return <ellipse key={i} cx={x} cy={y} rx="6" ry="2.5" fill={palette.accent} opacity={0.5 + (seed / 17) * 0.4} transform={`rotate(${rotSeed - 30} ${x} ${y})`} />;
      })}
      {/* Garnish leaves */}
      <path d="M140 175 q15-20 30-5 q-15 5-30 5z" fill={palette.garnish} opacity="0.8" />
      <path d="M260 180 q-10-22 10-10 q-8 8-10 10z" fill={palette.garnish} opacity="0.7" />
      {/* Sauce drizzle */}
      <ellipse cx="180" cy="200" rx="25" ry="8" fill={palette.accent} opacity="0.3" />
    </g>
  );
}

function MeatIllustration({ palette }) {
  return (
    <g>
      {/* Plate */}
      <ellipse cx="200" cy="215" rx="140" ry="55" fill={palette.detail} opacity="0.1" />
      <ellipse cx="200" cy="210" rx="130" ry="50" fill="#fff" />
      <ellipse cx="200" cy="207" rx="125" ry="47" fill="#f9fafb" />
      {/* Meat slab */}
      <rect x="140" y="165" width="120" height="55" rx="12" fill={palette.accent} />
      <rect x="145" y="170" width="110" height="45" rx="10" fill={palette.detail} />
      {/* Grill marks */}
      <line x1="155" y1="175" x2="245" y2="175" stroke="#7f1d1d" strokeWidth="2" opacity="0.3" />
      <line x1="155" y1="190" x2="245" y2="190" stroke="#7f1d1d" strokeWidth="2" opacity="0.3" />
      <line x1="155" y1="205" x2="245" y2="205" stroke="#7f1d1d" strokeWidth="2" opacity="0.3" />
      {/* Fat marbling */}
      <path d="M160 185 q20-5 40 3 q20 8 40-2" stroke="#fca5a5" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Garnish */}
      <circle cx="275" cy="190" r="8" fill={palette.garnish} opacity="0.7" />
      <circle cx="125" cy="195" r="6" fill={palette.garnish} opacity="0.6" />
      {/* Sauce */}
      <ellipse cx="200" cy="218" rx="40" ry="10" fill={palette.accent} opacity="0.25" />
    </g>
  );
}

function ChickenIllustration({ palette }) {
  return (
    <g>
      {/* Plate */}
      <ellipse cx="200" cy="215" rx="135" ry="52" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="210" rx="128" ry="48" fill="#fff" />
      <ellipse cx="200" cy="207" rx="123" ry="45" fill="#fefce8" />
      {/* Drumstick */}
      <ellipse cx="175" cy="185" rx="35" ry="22" fill={palette.accent} transform="rotate(-15 175 185)" />
      <ellipse cx="175" cy="183" rx="30" ry="18" fill={palette.detail} transform="rotate(-15 175 183)" />
      {/* Bone */}
      <rect x="140" y="160" width="8" height="30" rx="4" fill="#fef3c7" transform="rotate(-30 144 175)" />
      <circle cx="136" cy="155" r="5" fill="#fef3c7" />
      {/* Thigh piece */}
      <ellipse cx="230" cy="195" rx="30" ry="20" fill={palette.accent} transform="rotate(10 230 195)" />
      <ellipse cx="230" cy="193" rx="26" ry="16" fill={palette.detail} transform="rotate(10 230 193)" />
      {/* Crispy skin texture */}
      <circle cx="175" cy="180" r="2" fill={palette.garnish} opacity="0.4" />
      <circle cx="185" cy="178" r="1.5" fill={palette.garnish} opacity="0.3" />
      <circle cx="225" cy="190" r="2" fill={palette.garnish} opacity="0.4" />
      {/* Lemon wedge */}
      <path d="M270 195 q5-15 15-5 q-10 5-15 5z" fill="#fbbf24" opacity="0.8" />
    </g>
  );
}

function FishIllustration({ palette }) {
  return (
    <g>
      {/* Plate */}
      <ellipse cx="200" cy="218" rx="135" ry="50" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="213" rx="128" ry="46" fill="#fff" />
      <ellipse cx="200" cy="210" rx="123" ry="43" fill="#eff6ff" />
      {/* Fish body */}
      <path d="M110 195 q30-45 90-35 q60 5 90 25 q-20 25-90 30 q-60 5-90-20z" fill={palette.accent} />
      <path d="M115 193 q30-40 85-32 q55 5 82 22 q-18 22-85 27 q-55 5-82-17z" fill={palette.detail} opacity="0.5" />
      {/* Fish tail */}
      <path d="M275 180 l25-20 l5 20 l-5 20 z" fill={palette.accent} opacity="0.8" />
      {/* Fish eye */}
      <circle cx="130" cy="190" r="4" fill="#1e293b" />
      <circle cx="131" cy="189" r="1.5" fill="#fff" />
      {/* Scale pattern */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${160 + i * 20} ${175 + i * 3} q10-8 20 0 q-10 8-20 0z`} fill="#fff" opacity="0.15" />
      ))}
      {/* Lemon */}
      <circle cx="270" cy="205" r="12" fill="#fbbf24" opacity="0.7" />
      <circle cx="270" cy="205" r="8" fill="#fef9c3" opacity="0.5" />
      {/* Herb garnish */}
      <path d="M120 205 q10-15 20-5 q-10 5-20 5z" fill={palette.garnish} opacity="0.7" />
    </g>
  );
}

function SoupIllustration({ palette }) {
  return (
    <g>
      {/* Bowl shadow */}
      <ellipse cx="200" cy="225" rx="120" ry="35" fill={palette.detail} opacity="0.1" />
      {/* Bowl */}
      <path d="M80 180 q0 55 120 55 q120 0 120-55z" fill="#fff" />
      <path d="M85 180 q0 50 115 50 q115 0 115-50z" fill={palette.bg} />
      {/* Soup liquid */}
      <ellipse cx="200" cy="180" rx="115" ry="30" fill={palette.accent} opacity="0.7" />
      <ellipse cx="200" cy="178" rx="110" ry="27" fill={palette.accent} opacity="0.5" />
      {/* Steam */}
      <path d="M170 145 q5-15 0-25 q-5 10 0 25" stroke={palette.detail} strokeWidth="2" fill="none" opacity="0.2" />
      <path d="M200 140 q5-18 0-30 q-5 12 0 30" stroke={palette.detail} strokeWidth="2" fill="none" opacity="0.2" />
      <path d="M230 145 q5-15 0-25 q-5 10 0 25" stroke={palette.detail} strokeWidth="2" fill="none" opacity="0.2" />
      {/* Floating ingredients */}
      <circle cx="175" cy="178" r="5" fill={palette.detail} opacity="0.4" />
      <circle cx="210" cy="175" r="4" fill={palette.garnish} opacity="0.5" />
      <circle cx="225" cy="180" r="3" fill="#fff" opacity="0.3" />
      {/* Herbs on top */}
      <path d="M190 172 q8-12 16-2 q-8 2-16 2z" fill={palette.garnish} opacity="0.7" />
    </g>
  );
}

function StewIllustration({ palette }) {
  return (
    <g>
      {/* Bowl shadow */}
      <ellipse cx="200" cy="225" rx="115" ry="33" fill={palette.detail} opacity="0.1" />
      {/* Bowl */}
      <path d="M90 185 q0 50 110 50 q110 0 110-50z" fill="#fff" />
      <path d="M95 185 q0 45 105 45 q105 0 105-45z" fill="#fef2f2" />
      {/* Thick stew */}
      <ellipse cx="200" cy="185" rx="105" ry="28" fill={palette.accent} opacity="0.8" />
      <ellipse cx="200" cy="183" rx="100" ry="25" fill={palette.detail} opacity="0.4" />
      {/* Chunks of meat/veg */}
      <rect x="155" y="175" width="18" height="14" rx="3" fill={palette.accent} opacity="0.6" />
      <rect x="200" y="177" width="15" height="12" rx="3" fill="#f59e0b" opacity="0.5" />
      <rect x="225" y="174" width="16" height="13" rx="3" fill={palette.garnish} opacity="0.5" />
      <circle cx="175" cy="180" r="6" fill="#fbbf24" opacity="0.4" />
      {/* Oil sheen */}
      <ellipse cx="185" cy="180" rx="20" ry="6" fill="#fff" opacity="0.15" />
      {/* Steam */}
      <path d="M180 150 q4-12 0-20" stroke={palette.detail} strokeWidth="1.5" fill="none" opacity="0.2" />
      <path d="M210 148 q4-14 0-22" stroke={palette.detail} strokeWidth="1.5" fill="none" opacity="0.2" />
    </g>
  );
}

function VegetableIllustration({ palette }) {
  return (
    <g>
      {/* Plate */}
      <ellipse cx="200" cy="215" rx="130" ry="50" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="210" rx="125" ry="47" fill="#fff" />
      <ellipse cx="200" cy="207" rx="120" ry="44" fill="#f0fdf4" />
      {/* Broccoli florets */}
      <circle cx="160" cy="185" r="18" fill={palette.accent} />
      <circle cx="150" cy="178" r="14" fill={palette.detail} opacity="0.7" />
      <circle cx="170" cy="178" r="12" fill={palette.detail} opacity="0.6" />
      <circle cx="160" cy="172" r="10" fill={palette.detail} opacity="0.5" />
      {/* Carrots */}
      <rect x="195" y="180" width="8" height="30" rx="4" fill="#f97316" transform="rotate(-10 199 195)" />
      <rect x="210" y="182" width="7" height="28" rx="3.5" fill="#ea580c" transform="rotate(5 213 196)" />
      <rect x="223" y="184" width="8" height="26" rx="4" fill="#f97316" transform="rotate(-5 227 197)" />
      {/* Cherry tomatoes */}
      <circle cx="250" cy="190" r="9" fill="#ef4444" />
      <circle cx="250" cy="189" r="7" fill="#dc2626" />
      <circle cx="250" cy="188" r="2" fill="#fff" opacity="0.3" />
      {/* Lettuce leaf */}
      <path d="M125 200 q20-30 50-10 q-25 5-50 10z" fill={palette.garnish} opacity="0.6" />
    </g>
  );
}

function SaladIllustration({ palette }) {
  return (
    <g>
      {/* Bowl */}
      <ellipse cx="200" cy="215" rx="125" ry="48" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="210" rx="120" ry="45" fill="#fff" />
      <ellipse cx="200" cy="208" rx="115" ry="42" fill="#ecfdf5" />
      {/* Lettuce leaves */}
      <path d="M130 195 q30-35 70-15 q-35 10-70 15z" fill="#22c55e" opacity="0.6" />
      <path d="M170 190 q30-30 60-12 q-30 8-60 12z" fill="#16a34a" opacity="0.5" />
      <path d="M210 193 q25-28 50-10 q-25 8-50 10z" fill="#15803d" opacity="0.4" />
      {/* Tomato slices */}
      <circle cx="160" cy="185" r="10" fill="#ef4444" opacity="0.8" />
      <circle cx="160" cy="185" r="7" fill="#fca5a5" opacity="0.3" />
      <circle cx="230" cy="188" r="8" fill="#ef4444" opacity="0.7" />
      <circle cx="230" cy="188" r="5" fill="#fca5a5" opacity="0.3" />
      {/* Cucumber slices */}
      <ellipse cx="185" cy="182" rx="8" ry="6" fill="#86efac" opacity="0.7" />
      <ellipse cx="185" cy="182" rx="5" ry="3.5" fill="#bbf7d0" opacity="0.5" />
      {/* Onion rings */}
      <ellipse cx="210" cy="180" rx="10" ry="5" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
      {/* Croutons */}
      <rect x="145" y="178" width="8" height="8" rx="2" fill="#fbbf24" opacity="0.6" transform="rotate(15 149 182)" />
      <rect x="240" y="185" width="7" height="7" rx="2" fill="#f59e0b" opacity="0.5" transform="rotate(-10 243 188)" />
    </g>
  );
}

function BreadIllustration({ palette }) {
  return (
    <g>
      {/* Plate */}
      <ellipse cx="200" cy="218" rx="130" ry="48" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="213" rx="125" ry="45" fill="#fff" />
      {/* Chapati / flatbread */}
      <ellipse cx="200" cy="195" rx="85" ry="40" fill={palette.accent} />
      <ellipse cx="200" cy="193" rx="80" ry="37" fill={palette.detail} opacity="0.4" />
      {/* Brown spots (char marks) */}
      <circle cx="175" cy="185" r="8" fill="#92400e" opacity="0.25" />
      <circle cx="210" cy="188" r="10" fill="#92400e" opacity="0.2" />
      <circle cx="190" cy="198" r="7" fill="#92400e" opacity="0.2" />
      <circle cx="225" cy="193" r="6" fill="#92400e" opacity="0.15" />
      <circle cx="165" cy="200" r="5" fill="#92400e" opacity="0.18" />
      {/* Fold line */}
      <path d="M150 190 q50-10 100 0" stroke={palette.detail} strokeWidth="1" fill="none" opacity="0.2" />
      {/* Butter pat */}
      <ellipse cx="200" cy="185" rx="15" ry="8" fill="#fef08a" opacity="0.6" />
      <ellipse cx="200" cy="184" rx="12" ry="6" fill="#fde047" opacity="0.4" />
    </g>
  );
}

function PastaIllustration({ palette }) {
  return (
    <g>
      {/* Bowl */}
      <ellipse cx="200" cy="220" rx="125" ry="45" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="215" rx="120" ry="42" fill="#fff" />
      <ellipse cx="200" cy="212" rx="115" ry="39" fill="#fefce8" />
      {/* Spaghetti strands */}
      {[...Array(12)].map((_, i) => {
        const startX = 140 + i * 10;
        const y = 195 + Math.sin(i * 0.8) * 8;
        return (
          <path
            key={i}
            d={`M${startX} ${y} q${15 + i * 2} ${-20 - i} ${30 + i * 3} ${5 + i}`}
            stroke={palette.accent}
            strokeWidth="2.5"
            fill="none"
            opacity={0.5 + ((i * 3 + 1) % 10) / 30}
          />
        );
      })}
      {/* Sauce */}
      <ellipse cx="200" cy="195" rx="55" ry="20" fill={palette.detail} opacity="0.3" />
      <ellipse cx="200" cy="193" rx="45" ry="16" fill="#ef4444" opacity="0.25" />
      {/* Basil leaves */}
      <path d="M215 185 q10-15 20-3 q-10 3-20 3z" fill="#16a34a" opacity="0.7" />
      <path d="M175 188 q8-12 16-2 q-8 2-16 2z" fill="#15803d" opacity="0.6" />
      {/* Parmesan shavings */}
      <rect x="190" y="180" width="5" height="3" rx="1" fill="#fef9c3" opacity="0.5" transform="rotate(20 192 181)" />
      <rect x="205" y="182" width="4" height="2.5" rx="1" fill="#fef9c3" opacity="0.4" transform="rotate(-15 207 183)" />
    </g>
  );
}

function UgaliIllustration({ palette }) {
  return (
    <g>
      {/* Plate */}
      <ellipse cx="200" cy="215" rx="130" ry="50" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="210" rx="125" ry="47" fill="#fff" />
      <ellipse cx="200" cy="207" rx="120" ry="44" fill="#f5f5f4" />
      {/* Ugali dome */}
      <path d="M135 210 q0-65 65-65 q65 0 65 65z" fill="#fafaf9" />
      <path d="M140 208 q0-60 60-60 q60 0 60 60z" fill="#e7e5e4" />
      {/* Smooth surface */}
      <ellipse cx="200" cy="180" rx="55" ry="20" fill="#d6d3d1" opacity="0.3" />
      {/* Sheen */}
      <ellipse cx="190" cy="175" rx="25" ry="10" fill="#fff" opacity="0.15" />
      {/* Side dish - greens (sukuma wiki) */}
      <path d="M265 195 q15-20 30-5 q-15 5-30 5z" fill="#16a34a" opacity="0.6" />
      <path d="M275 200 q12-18 25-3 q-12 3-25 3z" fill="#15803d" opacity="0.5" />
      {/* Side dish - stew */}
      <circle cx="120" cy="200" r="15" fill="#ea580c" opacity="0.3" />
      <circle cx="120" cy="198" r="12" fill="#dc2626" opacity="0.25" />
    </g>
  );
}

function DessertIllustration({ palette }) {
  return (
    <g>
      {/* Plate */}
      <ellipse cx="200" cy="218" rx="120" ry="45" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="213" rx="115" ry="42" fill="#fff" />
      {/* Cake slice / dessert */}
      <path d="M150 195 l50-40 l50 40 l-50 20z" fill={palette.accent} />
      <path d="M153 193 l47-37 l47 37 l-47 18z" fill={palette.detail} opacity="0.4" />
      {/* Frosting layers */}
      <path d="M155 185 l45-5 45 5" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M158 195 l43 2 43-2" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.4" />
      {/* Cherry on top */}
      <circle cx="200" cy="155" r="7" fill="#dc2626" />
      <circle cx="198" cy="153" r="2" fill="#fff" opacity="0.4" />
      <path d="M200 148 q3-12 8-15" stroke="#16a34a" strokeWidth="1.5" fill="none" />
      {/* Sprinkles */}
      {[...Array(8)].map((_, i) => {
        const x = 165 + i * 10;
        const y = 175 + Math.sin(i) * 5;
        return <rect key={i} x={x} y={y} width="3" height="1.5" rx="0.75" fill={i % 2 === 0 ? "#fbbf24" : "#ec4899"} opacity="0.5" transform={`rotate(${i * 30} ${x} ${y})`} />;
      })}
      {/* Powdered sugar dust */}
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={170 + i * 12} cy={200 + Math.sin(i) * 3} r="1" fill="#fff" opacity="0.4" />
      ))}
    </g>
  );
}

function DrinkIllustration({ palette }) {
  return (
    <g>
      {/* Glass shadow */}
      <ellipse cx="200" cy="230" rx="40" ry="10" fill={palette.detail} opacity="0.08" />
      {/* Glass */}
      <path d="M165 120 l-5 100 q0 12 40 12 q40 0 40-12 l-5-100z" fill="#fff" opacity="0.3" />
      <path d="M167 125 l-4 95 q0 10 37 10 q37 0 37-10 l-4-95z" fill="#fff" opacity="0.15" />
      {/* Liquid */}
      <path d="M163 145 l-3 75 q0 12 40 12 q40 0 40-12 l-3-75z" fill={palette.accent} opacity="0.6" />
      <path d="M165 148 l-2 72 q0 10 37 10 q37 0 37-10 l-2-72z" fill={palette.accent} opacity="0.4" />
      {/* Liquid surface */}
      <ellipse cx="200" cy="145" rx="37" ry="8" fill={palette.accent} opacity="0.5" />
      {/* Ice cubes */}
      <rect x="182" y="155" width="12" height="10" rx="2" fill="#fff" opacity="0.4" />
      <rect x="200" y="152" width="11" height="11" rx="2" fill="#fff" opacity="0.35" />
      <rect x="190" y="165" width="10" height="9" rx="2" fill="#fff" opacity="0.3" />
      {/* Straw */}
      <rect x="210" y="105" width="4" height="100" rx="2" fill={palette.detail} opacity="0.4" />
      {/* Garnish */}
      <circle cx="170" cy="140" r="6" fill={palette.garnish} opacity="0.6" />
      <circle cx="170" cy="140" r="3" fill="#fff" opacity="0.3" />
      {/* Bubbles */}
      <circle cx="185" cy="175" r="2" fill="#fff" opacity="0.25" />
      <circle cx="210" cy="180" r="1.5" fill="#fff" opacity="0.2" />
      <circle cx="195" cy="190" r="2.5" fill="#fff" opacity="0.2" />
    </g>
  );
}

function FruitIllustration({ palette }) {
  return (
    <g>
      {/* Bowl */}
      <ellipse cx="200" cy="218" rx="110" ry="42" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="213" rx="105" ry="39" fill="#fff" />
      <ellipse cx="200" cy="210" rx="100" ry="36" fill={palette.bg} />
      {/* Apple */}
      <circle cx="170" cy="185" r="22" fill="#ef4444" />
      <circle cx="170" cy="183" r="18" fill="#dc2626" opacity="0.4" />
      <circle cx="165" cy="178" r="5" fill="#fff" opacity="0.15" />
      <path d="M170 163 q5-10 3-18" stroke="#16a34a" strokeWidth="2" fill="none" />
      <path d="M173 165 q8-5 15-2" stroke="#16a34a" strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* Banana */}
      <path d="M210 195 q40-35 60-20 q-25 5-55 25z" fill="#fbbf24" />
      <path d="M213 193 q35-30 55-18 q-22 5-50 22z" fill="#f59e0b" opacity="0.4" />
      <path d="M215 192 q30-25 45-15" stroke="#a16207" strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* Orange */}
      <circle cx="220" cy="178" r="18" fill="#f97316" />
      <circle cx="220" cy="176" r="14" fill="#ea580c" opacity="0.3" />
      <path d="M220 163 l0 6" stroke="#16a34a" strokeWidth="2" />
      <path d="M220 163 q6-4 12-2" stroke="#16a34a" strokeWidth="1.5" fill="none" />
      {/* Grapes */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={140 + (i % 3) * 10} cy={170 + Math.floor(i / 3) * 10} r="6" fill="#8b5cf6" opacity="0.7" />
      ))}
    </g>
  );
}

function DefaultFoodIllustration({ palette }) {
  return (
    <g>
      {/* Plate */}
      <ellipse cx="200" cy="215" rx="135" ry="52" fill={palette.detail} opacity="0.08" />
      <ellipse cx="200" cy="210" rx="128" ry="48" fill="#fff" />
      <ellipse cx="200" cy="207" rx="123" ry="45" fill="#f9fafb" />
      {/* Food mound */}
      <ellipse cx="200" cy="190" rx="70" ry="35" fill={palette.accent} opacity="0.3" />
      <ellipse cx="200" cy="187" rx="60" ry="28" fill={palette.accent} opacity="0.2" />
      {/* Fork */}
      <line x1="120" y1="140" x2="120" y2="230" stroke={palette.detail} strokeWidth="2" opacity="0.2" />
      <line x1="115" y1="140" x2="115" y2="165" stroke={palette.detail} strokeWidth="1.5" opacity="0.2" />
      <line x1="120" y1="140" x2="120" y2="165" stroke={palette.detail} strokeWidth="1.5" opacity="0.2" />
      <line x1="125" y1="140" x2="125" y2="165" stroke={palette.detail} strokeWidth="1.5" opacity="0.2" />
      {/* Knife */}
      <line x1="280" y1="140" x2="280" y2="230" stroke={palette.detail} strokeWidth="2" opacity="0.2" />
      <path d="M280 140 q8 0 8 25 q0 0-8 0z" fill={palette.detail} opacity="0.12" />
      {/* Garnish */}
      <path d="M175 180 q10-18 20-5 q-10 5-20 5z" fill={palette.garnish} opacity="0.4" />
      {/* Steam */}
      <path d="M185 155 q3-10 0-18" stroke={palette.detail} strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M200 150 q3-12 0-20" stroke={palette.detail} strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M215 155 q3-10 0-18" stroke={palette.detail} strokeWidth="1.5" fill="none" opacity="0.15" />
    </g>
  );
}

const ILLUSTRATIONS = {
  rice: RiceIllustration,
  meat: MeatIllustration,
  chicken: ChickenIllustration,
  fish: FishIllustration,
  soup: SoupIllustration,
  stew: StewIllustration,
  vegetable: VegetableIllustration,
  salad: SaladIllustration,
  bread: BreadIllustration,
  pasta: PastaIllustration,
  ugali: UgaliIllustration,
  dessert: DessertIllustration,
  drink: DrinkIllustration,
  fruit: FruitIllustration,
};

export default function FoodIllustration({ name, description, className, style }) {
  const foodType = detectFoodType(name, description);
  const palette = foodType ? FOOD_PALETTES[foodType] : DEFAULT_PALETTE;
  const Illustration = foodType ? ILLUSTRATIONS[foodType] : DefaultFoodIllustration;

  return (
    <svg
      viewBox="0 0 400 260"
      className={`food-illustration ${className || ""}`}
      style={{ width: "100%", height: "100%", ...style }}
      aria-hidden="true"
      role="img"
    >
      {/* Background */}
      <rect width="400" height="260" fill={palette.bg} rx="0" />
      {/* Food illustration */}
      <Illustration palette={palette} />
      {/* Subtle vignette */}
      <rect width="400" height="260" fill="url(#vignette)" />
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.04)" />
        </radialGradient>
      </defs>
    </svg>
  );
}
