import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Semester = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    fetchSubjectsAndNotes();
  }, [id, selectedSubject]);

  const fetchSubjectsAndNotes = async () => {
    setLoading(true);
    try {
      // Get auth token (from Clerk or admin)
      const token = localStorage.getItem('clerkToken') || localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch subjects for this semester
      const subjectsResponse = await fetch(`http://localhost:5000/api/subjects/semester/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (subjectsResponse.ok) {
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData.subjects || []);
      }

      // Fetch notes for selected subject - use public API endpoint
      let notesUrl = `http://localhost:5000/api/notes/semester/${id}/subject/${selectedSubject}`;
      
      const notesResponse = await fetch(notesUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (notesResponse.ok) {
        const notesData = await notesResponse.json();
        if (notesData.success) {
          // Group notes by subject
          const groupedNotes = {};
          notesData.notes.forEach(note => {
            if (!groupedNotes[note.subject]) {
              groupedNotes[note.subject] = [];
            }
            groupedNotes[note.subject].push(note);
          });
          setNotes(groupedNotes);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Semester {id}</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Semester.jsx - Redesigned (only the UI parts)
// ... existing imports and logic

return (
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-white mb-2">Semester {id} Subjects</h1>
      <p className="text-purple-200">Hello {user?.firstName}, select a subject to view notes</p>
    </div>

    {/* Subject Filter */}
    <div className="glass-effect p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Filter by Subject</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-4 py-2 rounded-lg ${
            selectedSubject === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
              : 'bg-gray-700 text-purple-200 hover:bg-gray-600'
          }`}
        >
          All Subjects
        </button>
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-4 py-2 rounded-lg ${
              selectedSubject === subject
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                : 'bg-gray-700 text-purple-200 hover:bg-gray-600'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>

    {/* Notes Display */}
    {selectedSubject === 'all' ? (
      // Show all subjects
      <div className="space-y-6">
        {Object.entries(notes).map(([subject, subjectNotes]) => (
          <div key={subject} className="glass-effect overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">{subject}</h2>
              <p className="text-purple-100">{subjectNotes.length} notes available</p>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {subjectNotes.map(note => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      // Show selected subject only
      <div className="glass-effect overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">{selectedSubject}</h2>
          <p className="text-purple-100">
            {(notes[selectedSubject] || []).length} notes available
          </p>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {(notes[selectedSubject] || []).map(note => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        </div>
      </div>
    )}

    {Object.keys(notes).length === 0 && (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No notes available</h3>
        <p className="text-purple-200">There are no notes available for this semester yet.</p>
      </div>
    )}
  </div>
);
}

// Note Card Component with proper link
const NoteCard = ({ note }) => {
  return (
    <Link to={`/notes/${note._id}`} className="block group">
      <div className="glass-effect p-4 hover:shadow-purple-500/20 transition-shadow group-hover:border-purple-500/50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
            {note.title}
          </h3>
          <span className="bg-purple-900/50 text-purple-300 text-xs font-medium px-2 py-1 rounded-full">
            {note.semester} Sem
          </span>
        </div>
        <p className="text-purple-200 text-sm mb-3 line-clamp-2">{note.description}</p>
        <div className="flex items-center justify-between text-sm text-purple-300">
          <span>By {note.uploader?.firstName} {note.uploader?.lastName}</span>
          <span>{note.downloads || 0} downloads</span>
        </div>
      </div>
    </Link>
  );
};
export default Semester;