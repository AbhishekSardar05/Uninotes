// Notes.jsx - Redesigned
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const Notes = () => {
  const { id } = useParams()
  const { user } = useUser()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNote()
  }, [id])

  const fetchNote = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('clerkToken') || localStorage.getItem('adminToken')
      
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setNote(data.note)
        } else {
          setError(data.message || 'Failed to load note')
        }
      } else {
        setError('Failed to load note')
      }
    } catch (error) {
      console.error('Error fetching note:', error)
      setError('Failed to load note')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('clerkToken') || localStorage.getItem('adminToken')
      
      const response = await fetch(`http://localhost:5000/api/notes/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Get filename from content-disposition header
        const contentDisposition = response.headers.get('content-disposition')
        let filename = 'note.pdf'
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }

        // Convert response to blob and create download link
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        // Refresh the note to update download count
        fetchNote()
      } else {
        alert('Failed to download note')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download note')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-4 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-white mb-2">Note not found</h3>
        <p className="text-purple-200">{error || 'The requested note does not exist or may have been removed.'}</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to={`/semester/${note.semester}`} className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium mb-4 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Semester {note.semester}
        </Link>
        
        <div className="glass-effect p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{note.title}</h1>
              <p className="text-purple-200 mb-2">{note.subject}</p>
            </div>
            <span className="bg-purple-900/50 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Semester {note.semester}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-purple-300">
            <span>Uploaded on {new Date(note.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {note.downloads || 0} downloads
            </span>
          </div>
        </div>
      </div>

      <div className="glass-effect p-6">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-4 text-white">Note Description</h2>
          <p className="text-purple-200 mb-6">{note.description}</p>
          
          <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2 text-white">File Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-purple-300">File Name:</span> {note.file?.originalName}
              </div>
              <div>
                <span className="font-medium text-purple-300">File Size:</span> {note.file?.size ? Math.round(note.file.size / 1024) : 'Unknown'} KB
              </div>
              <div>
                <span className="font-medium text-purple-300">Uploaded By:</span> {note.uploader?.firstName} {note.uploader?.lastName}
              </div>
              <div>
                <span className="font-medium text-purple-300">Upload Date:</span> {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex space-x-4">
          <button 
            onClick={handleDownload}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-600 flex items-center transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Note
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notes