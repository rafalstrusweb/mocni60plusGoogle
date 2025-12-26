import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { GigsPage } from './pages/GigsPage'
import { TravelPage } from './pages/TravelPage'
import { CommunityPage } from './pages/CommunityPage'
import { HealthPage } from './pages/HealthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { CameraPage } from './pages/CameraPage'
import { VerificationPage } from './pages/VerificationPage'
import { LocalEventsPage } from './pages/LocalEventsPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground antialiased">
            <Routes>
                {/* Public routes */}
                <Route path="/onboarding" element={<OnboardingPage />} />

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
                <Route path="/camera" element={
                    <ProtectedRoute>
                        <CameraPage />
                    </ProtectedRoute>
                } />
                <Route path="/verify" element={
                    <ProtectedRoute>
                        <VerificationPage />
                    </ProtectedRoute>
                } />
                <Route path="/events" element={
                    <ProtectedRoute>
                        <LocalEventsPage />
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
