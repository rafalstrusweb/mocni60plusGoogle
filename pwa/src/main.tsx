import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider } from './context/AuthContext.tsx'
import { MockAuthProvider, MockAuthContext } from './context/MockAuthContext.tsx'
import { NotificationProvider } from './context/NotificationContext.tsx'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

if (!USE_MOCK_AUTH && !CLERK_KEY) {
    throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()

// Wrapper to bridge MockContext to AuthContext expected by App
// Since App uses 'useAuth' from AuthContext, we need to make sure we provide the right context.
// Actually, simpler: We make AuthContext export a wrapper that chooses internally?
// Or we just update AuthContext to handle the mock mode.
// UPDATE: Updating AuthContext is cleaner than duplicate Providers.
// Reverting main.tsx changes and updating AuthContext.tsx instead.

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {USE_MOCK_AUTH ? (
                    <AuthProvider>
                        <NotificationProvider>
                            <App />
                        </NotificationProvider>
                    </AuthProvider>
                ) : (
                    <ClerkProvider publishableKey={CLERK_KEY} afterSignOutUrl="/">
                        <AuthProvider>
                            <NotificationProvider>
                                <App />
                            </NotificationProvider>
                        </AuthProvider>
                    </ClerkProvider>
                )}
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
)

// Helper to injection Mock Context into the App's useAuth 
// Note: This requires App to use a specific hook. 
// BETTER PLAN: Modify AuthContext.tsx to support Mock Mode natively.
