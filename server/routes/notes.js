const express = require('express');
const router = express.Router();
const { auth, isOwner } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const {
  getNotes,
  getNote,
  uploadNote,
  updateNote,
  deleteNote,
  downloadNote,
  getNotesBySemesterSubject
} = require('../controllers/noteController');

// Public routes (with authentication)
router.get('/', auth, getNotes);
router.get('/semester/:semester/subject/:subject', auth, getNotesBySemesterSubject);
router.get('/:id', auth, getNote);
router.get('/:id/download', auth, downloadNote);

// Owner-only routes
router.post('/upload', auth, isOwner, upload.single('file'), uploadNote, handleUploadError);
router.put('/:id', auth, isOwner, updateNote);
router.delete('/:id', auth, isOwner, deleteNote);

// Debug endpoints
router.get('/debug/all', auth, async (req, res) => {
  try {
    const notes = await require('../models/Note').find()
      .populate('uploader', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes: notes.map(note => ({
        id: note._id,
        title: note.title,
        subject: note.subject,
        semester: note.semester,
        isPublic: note.isPublic,
        uploader: note.uploader,
        createdAt: note.createdAt,
        downloads: note.downloads
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;