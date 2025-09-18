import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Subject= () => {
  const { semester, subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubjectAndNotes();
  }, [semester, subjectId]);

  const fetchSubjectAndNotes = async () => {
    try {
      setLoading(true);
      
      // Fetch subject details
      const subjectResponse = await fetch(`http://localhost:5000/api/subjects/${subjectId}`);
      if (subjectResponse.ok) {
        const subjectData = await subjectResponse.json();
        setSubject(subjectData.subject);
      }

      // Fetch notes for this subject
      const notesResponse = await fetch(`http://localhost:5000/api/notes/subject/${subjectId}`);
      if (notesResponse.ok) {
        const notesData = await notesResponse.json();
        setNotes(notesData.notes || []);
      } else {
        setError('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (noteId, filename) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/download/${noteId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download note');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download note');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-400 hover:text-gray-500">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <Link to={`/semester/${semester}`} className="text-gray-400 hover:text-gray-500">
                Semester {semester}
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-gray-600">
              {subject?.name || 'Subject'}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {subject?.name || 'Subject Notes'}
          </h1>
          <p className="text-gray-600">
            Semester {semester} - {notes.length} notes available
          </p>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No notes available for this subject yet
            </div>
            <p className="text-gray-400">
              Check back later or contact your administrator
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {note.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Uploaded by: {note.uploader?.firstName} {note.uploader?.lastName}</span>
                  <span>{note.downloads || 0} downloads</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDownload(note._id, note.file?.originalName || 'note')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subject;