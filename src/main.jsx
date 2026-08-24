import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { MealOptionsProvider } from './context/MealOptionsContext.jsx'
import { MenuProvider } from './context/MenuContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'
import { DailyOptionsProvider } from './contexts/DailyOptionsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MealOptionsProvider>
        <MenuProvider>
          <OrdersProvider>
            <DailyOptionsProvider>
              <App />
            </DailyOptionsProvider>
          </OrdersProvider>
        </MenuProvider>
      </MealOptionsProvider>
    </AuthProvider>
  </StrictMode>,
)
