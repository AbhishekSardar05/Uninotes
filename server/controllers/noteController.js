const Note = require('../models/Note');
const fs = require('fs');
const path = require('path');

// Download note
const downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Only owners/admins can download private notes
    if (!note.isPublic && req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if file exists
    if (!note.file || !note.file.path) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    if (!fs.existsSync(note.file.path)) {
      return res.status(404).json({ success: false, message: 'File does not exist on server' });
    }

    // Increment download count
    note.downloads = (note.downloads || 0) + 1;
    await note.save();

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${note.file.originalName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(note.file.path);
    fileStream.pipe(res);

  } catch (error) {
    console.error('❌ Error downloading note:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all notes (public only for students, all for admins)
const getNotes = async (req, res) => {
  try {
    console.log('📋 Fetching notes for user:', req.user?._id, 'Role:', req.user?.role);
    
    const { semester, subject, page = 1, limit = 100 } = req.query;
    let query = {};
    
    // For students, only show public notes
    if (req.user?.role === 'student' || !req.user?.role) {
      query.isPublic = true;
      console.log('👨‍🎓 Showing only public notes for student');
    }
    
    // For admins, show all notes
    if (req.user?.role === 'admin' || req.user?.role === 'owner') {
      console.log('👨‍💼 Showing all notes for admin');
      // No filter for admins - show all notes
    }
    
    if (semester && semester !== 'all' && semester !== 'undefined') {
      query.semester = parseInt(semester);
      console.log('🔍 Filtering by semester:', semester);
    }
    
    if (subject && subject !== 'all' && subject !== 'undefined') {
      query.subject = new RegExp('^' + subject + '$', 'i'); // Exact match, case insensitive
      console.log('🔍 Filtering by subject:', subject);
    }

    const notes = await Note.find(query)
      .populate('uploader', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Note.countDocuments(query);

    console.log(`✅ Found ${notes.length} notes matching criteria`);

    res.json({
      success: true,
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Error fetching notes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get notes by semester and subject (Public API - always show public notes)
const getNotesBySemesterSubject = async (req, res) => {
  try {
    const { semester, subject } = req.params;
    
    console.log('📋 Fetching notes for semester:', semester, 'subject:', subject);

    let query = { 
      isPublic: true  // Always show only public notes to users
    };

    if (semester && semester !== 'all') {
      query.semester = parseInt(semester);
    }

    if (subject && subject !== 'all') {
      query.subject = new RegExp('^' + subject + '$', 'i'); // Exact match
    }

    const notes = await Note.find(query)
      .populate('uploader', 'firstName lastName email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${notes.length} public notes`);

    res.json({
      success: true,
      notes,
      count: notes.length
    });
  } catch (error) {
    console.error('❌ Error fetching notes by semester/subject:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Upload new note (Owner/Admin only)
const uploadNote = async (req, res) => {
  try {
    console.log('📤 Note upload request received');
    console.log('📦 File details:', req.file);
    console.log('📝 Body details:', req.body);
    
    if (!req.file) {
      console.log('❌ No file provided');
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, description, subject, semester, isPublic } = req.body;

    console.log('📝 Note details:', {
      title,
      subject,
      semester,
      isPublic: isPublic === 'true',
      filename: req.file.originalname
    });

    // Create new note - ensure isPublic is properly set
    const note = new Note({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      semester: parseInt(semester),
      isPublic: isPublic === 'true', // Convert string to boolean
      uploader: req.user._id,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      }
    });

    await note.save();
    await note.populate('uploader', 'firstName lastName email');
    
    console.log('✅ Note saved successfully:', {
      id: note._id,
      title: note.title,
      subject: note.subject,
      semester: note.semester,
      isPublic: note.isPublic
    });

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      note
    });
  } catch (error) {
    console.error('❌ Error uploading note:', error);
    
    // Clean up uploaded file if note creation failed
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get single note
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploader', 'firstName lastName email');
    
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Only owners/admins can see private notes
    if (!note.isPublic && req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update note (Owner only)
const updateNote = async (req, res) => {
  try {
    const { title, description, subject, semester, isPublic } = req.body;
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if user is the uploader or admin
    if (note.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        subject,
        semester: parseInt(semester),
        isPublic: isPublic === 'true'
      },
      { new: true, runValidators: true }
    ).populate('uploader', 'firstName lastName email');

    res.json({ success: true, note: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete note (Owner only)
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if user is the uploader or admin
    if (note.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Delete file from filesystem
    if (note.file && note.file.path) {
      fs.unlink(note.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotes,
  getNote,
  uploadNote,
  updateNote,
  deleteNote,
  downloadNote,
  getNotesBySemesterSubject
};