import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

// Layout Components
import Nav from './components/Nav'
import Footer from './components/Footer'

// Page Components
import Home from './pages/Home'
import Booking from './pages/Booking'
import Blog from './pages/Blog'
import Admin from './pages/Admin'

/**
 * ScrollToTop component resets viewport scroll position to (0,0)
 * whenever the location path changes during navigation.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  const location = useLocation()

  // Suppress public Nav and Footer when viewing the Admin Dashboard
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <ScrollToTop />

      {/* Global Navigation - Rendered on all public routes */}
      {!isAdminRoute && <Nav />}

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Catch-all route redirecting unknown paths to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer - Rendered on all public routes */}
      {!isAdminRoute && <Footer />}
    </div>
  )
}