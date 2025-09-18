// Auth.jsx - Redesigned
import { SignIn, SignUp } from '@clerk/clerk-react'

const Auth = ({ mode = "sign-in" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            {mode === "sign-in" ? "Sign in to UniNotes" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            {mode === "sign-in" 
              ? "Access all your semester notes" 
              : "Start organizing your semester notes"
            }
          </p>
        </div>
        
        <div className="glass-effect py-8 px-6 sm:px-10">
          {mode === "sign-in" ? <SignIn /> : <SignUp />}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-purple-200">
            {mode === "sign-in" 
              ? "Don't have an account? " 
              : "Already have an account? "
            }
            <a 
              href={mode === "sign-in" ? "/sign-up" : "/sign-in"} 
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              {mode === "sign-in" ? "Sign up" : "Sign in"}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth