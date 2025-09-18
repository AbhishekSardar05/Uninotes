// Home.jsx - Redesigned
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import Logo from '../components/Logo'

const Home = () => {
  const { user } = useUser()
  
  return (
  <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 float-animation">
          <Logo className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">
          Your Semester Notes Hub
        </h1>
        <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
          Access all your semester notes in one place. Organized by subject and semester for easy studying.
        </p>
        
        <SignedOut>
          <div className="flex justify-center space-x-4">
            <Link to="/sign-up" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/sign-in" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="flex flex-col items-center">
            <p className="text-lg text-purple-200 mb-6">
              Welcome back, {user?.firstName || 'Student'}! Ready to continue studying?
            </p>
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
              Go to Dashboard
            </Link>
          </div>
        </SignedIn>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Why Choose UniNotes?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
            <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Organized Notes</h3>
            <p className="text-purple-200">Notes organized by semester and subject for easy access.</p>
          </div>
          
          <div className="card text-center transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
            <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Secure Access</h3>
            <p className="text-purple-200">Secure authentication to ensure only students can access notes.</p>
          </div>
          
          <div className="card text-center transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
            <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Easy Search</h3>
            <p className="text-purple-200">Quickly find the notes you need with our organized system.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">1</div>
            <h3 className="font-semibold mb-2 text-white">Sign Up</h3>
            <p className="text-sm text-purple-200">Create your student account</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">2</div>
            <h3 className="font-semibold mb-2 text-white">Select Semester</h3>
            <p className="text-sm text-purple-200">Choose your current semester</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">3</div>
            <h3 className="font-semibold mb-2 text-white">Pick Subject</h3>
            <p className="text-sm text-purple-200">Select the subject you need</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg">4</div>
            <h3 className="font-semibold mb-2 text-white">Access Notes</h3>
            <p className="text-sm text-purple-200">View and download notes</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home