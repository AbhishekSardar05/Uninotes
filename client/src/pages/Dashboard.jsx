// Dashboard.jsx - Redesigned
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-4">Select Your Semester</h1>
        <p className="text-purple-200">Choose your current semester to access relevant notes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {semesters.map(semester => (
          <Link
            key={semester}
            to={`/semester/${semester}`}
            className="group"
          >
            <div className="glass-effect p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/20 border-2 border-transparent hover:border-purple-500/50">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-purple-700 group-hover:to-blue-600 transition-colors">
                <span className="text-white text-2xl font-bold">{semester}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Semester {semester}</h3>
              <p className="text-sm text-purple-200">View all subjects</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 glass-effect p-6 border border-purple-500/30">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-white">Need help finding your notes?</h3>
            <p className="mt-2 text-purple-200">
              Select your current semester to see all available subjects and their notes. If you can't find what you're looking for, contact your department.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard