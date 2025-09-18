// Header.jsx - Redesigned
import { UserButton, useUser, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'

const Header = () => {
  const { user } = useUser()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
      <header className="glass-effect sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          onClick={handleLogoClick}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <Logo className="w-10 h-10" />
          <span className="text-2xl font-bold text-white">UniNotes</span>
        </div>

        <nav className="hidden md:flex space-x-8">
          <Link 
            to="/" 
            className={`font-medium ${location.pathname === '/' ? 'text-purple-400' : 'text-purple-200 hover:text-white'} transition-colors duration-300`}
          >
            Home
          </Link>
          
          <Link 
            to="/admin" 
            className={`font-medium ${location.pathname === '/admin' ? 'text-purple-400' : 'text-purple-200 hover:text-white'} transition-colors duration-300`}
          >
            Admin
          </Link>
          
          <SignedIn>
            <Link 
              to="/dashboard" 
              className={`font-medium ${location.pathname === '/dashboard' ? 'text-purple-400' : 'text-purple-200 hover:text-white'} transition-colors duration-300`}
            >
              Dashboard
            </Link>
          </SignedIn>
        </nav>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <div className="hidden sm:flex items-center space-x-2 mr-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </span>
              </div>
              <span className="text-purple-200 font-medium">
                {user?.firstName || user?.username || 'User'}
              </span>
            </div>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonOuterIdentifier: "text-sm font-medium text-white"
                }
              }}
            />
          </SignedIn>
          
          <SignedOut>
            <div className="flex space-x-3">
              <Link to="/sign-in" className="btn-secondary">
                Sign In
              </Link>
              <Link to="/sign-up" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden bg-gray-800/80 backdrop-blur-md border-t border-purple-700/30">
        <div className="container mx-auto px-4 py-2 flex justify-around">
          <Link 
            to="/" 
            className={`flex flex-col items-center py-2 ${location.pathname === '/' ? 'text-purple-400' : 'text-purple-200'} transition-colors`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/admin" 
            className={`flex flex-col items-center py-2 ${location.pathname === '/admin' ? 'text-purple-400' : 'text-purple-200'} transition-colors`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">Admin</span>
          </Link>
          
          <SignedIn>
            <Link 
              to="/dashboard" 
              className={`flex flex-col items-center py-2 ${location.pathname === '/dashboard' ? 'text-purple-400' : 'text-purple-200'} transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

export default Header