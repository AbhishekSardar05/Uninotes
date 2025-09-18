import { useUser } from '@clerk/clerk-react'

const TempAdminButton = () => {
  const { user, isLoaded } = useUser()

  const makeAdmin = () => {
    localStorage.setItem('userRole', 'owner')
    alert('✅ You are now set as admin. Refresh the page to see admin options.')
  }

  const makeStudent = () => {
    localStorage.setItem('userRole', 'student')
    alert('✅ You are now set as student. Refresh the page.')
  }

  if (!isLoaded || !user) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-md border z-50">
      <p className="text-sm font-medium mb-2">Developer Tools: Set Role</p>
      <div className="space-x-2">
        <button 
          onClick={makeAdmin}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Make Admin
        </button>
        <button 
          onClick={makeStudent}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
        >
          Make Student
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Current role: {localStorage.getItem('userRole') || 'student'}</p>
    </div>
  )
}

export default TempAdminButton