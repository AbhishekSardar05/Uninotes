// App.jsx - Updated with new design
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { Home, Dashboard, Semester, Subject, Notes, SignIn, SignUp } from './pages'
import { Header } from './components'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import { clerkAppearance } from './utils/clerk'
import UserSync from './components/UserSync';
import Logo from './components/Logo'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.")
}

function App() {
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      appearance={clerkAppearance}
      navigate={(to) => window.location.href = to}
    >
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
          <Header />
          <UserSync />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <>
                    <SignedIn>
                      <Dashboard />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              
              <Route
                path="/semester/:id"
                element={
                  <>
                    <SignedIn>
                      <Semester />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              
              <Route
                path="/subject/:id"
                element={
                  <>
                    <SignedIn>
                      <Subject />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              
              <Route
                path="/notes/:id"
                element={
                  <>
                    <SignedIn>
                      <Notes />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              
              {/* Admin route - separate authentication */}
              <Route
                path="/admin"
                element={<AdminDashboard />}
              />
              
              {/* Catch all route - 404 page */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                      <p className="text-xl text-purple-200 mb-8">Page not found</p>
                      <a href="/" className="btn-primary">
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          
          {/* Footer */}
<footer className="bg-gray-800 bg-opacity-50 border-t border-purple-700 mt-16 backdrop-blur-sm">
  <div className="container mx-auto px-4 py-8">
    {/* Main footer content */}
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
      {/* Brand section */}
      <div className="md:col-span-4 flex flex-col items-center md:items-start">
        <div className="flex items-center space-x-2 mb-4">
          <Logo className="w-10 h-10" />
          <span className="text-2xl font-bold text-white">UniNotes</span>
        </div>
        <p className="text-purple-200 text-center md:text-left max-w-md">
          Your semester notes hub - organized, accessible, and always available when you need them most.
        </p>
      </div>

      {/* Links section */}
      <div className="md:col-span-4 grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
          <ul className="space-y-2">
            <li><a href="/semester/1" className="text-purple-300 hover:text-white transition-colors">First Year</a></li>
            <li><a href="/semester/2" className="text-purple-300 hover:text-white transition-colors">Second Year</a></li>
            <li><a href="/semester/3" className="text-purple-300 hover:text-white transition-colors">Third Year</a></li>
            <li><a href="/semester/4" className="text-purple-300 hover:text-white transition-colors">Final Year</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Company</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="text-purple-300 hover:text-white transition-colors">About Us</a></li>
            <li><a href="/contact" className="text-purple-300 hover:text-white transition-colors">Contact</a></li>
            <li><a href="/privacy" className="text-purple-300 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" className="text-purple-300 hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Contact section */}
      <div className="md:col-span-4">
        <h3 className="text-white font-semibold mb-4 text-lg">Get In Touch</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-purple-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-purple-200">uninotes@gmail.com</span>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-purple-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-purple-200">Education Hub, Academic Street</span>
          </div>
        </div>
        
        {/* Social media links */}
        <div className="flex space-x-4 mt-6">
          <a href="#" className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-700 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-700 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-700 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    {/* Bottom section */}
    <div className="pt-8 border-t border-purple-700/30">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-purple-300 text-sm">
          &copy; {new Date().getFullYear()} UniNotes. All rights reserved. Since 2025
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a href="/about" className="text-purple-300 hover:text-white transition-colors">
            <span className="font-medium">About:</span> Student resources made simple
          </a>
          <a href="/contact" className="text-purple-300 hover:text-white transition-colors">
            <span className="font-medium">Contact:</span> uninotes@gmail.com
          </a>
          <a href="/privacy" className="text-purple-300 hover:text-white transition-colors">
            <span className="font-medium">Privacy:</span> We protect your data
          </a>
          <a href="/terms" className="text-purple-300 hover:text-white transition-colors">
            <span className="font-medium">Terms:</span> Rules of use
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
        </div>
      </Router>
    </ClerkProvider>
  )
}

export default App