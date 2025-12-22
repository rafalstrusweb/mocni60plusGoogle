import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { GigsPage } from './pages/GigsPage'
import { TravelPage } from './pages/TravelPage'
import { CommunityPage } from './pages/CommunityPage'
import { HealthPage } from './pages/HealthPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground antialiased">
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/gigs" element={
                    <ProtectedRoute>
                        <GigsPage />
                    </ProtectedRoute>
                } />
                <Route path="/travel" element={
                    <ProtectedRoute>
                        <TravelPage />
                    </ProtectedRoute>
                } />
                <Route path="/community" element={
                    <ProtectedRoute>
                        <CommunityPage />
                    </ProtectedRoute>
                } />
                <Route path="/health" element={
                    <ProtectedRoute>
                        <HealthPage />
                    </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    )
}

export default App
