const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all unique subjects for a semester
router.get('/semester/:semester', async (req, res) => {
  try {
    const { semester } = req.params;
    
    const subjects = await Note.distinct('subject', {
      semester: parseInt(semester),
      isPublic: true
    });

    res.json({
      success: true,
      subjects: subjects.filter(subject => subject).sort() // Remove null/empty and sort
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching subjects' 
    });
  }
});

// Get all unique subjects across all semesters
router.get('/all', async (req, res) => {
  try {
    const subjects = await Note.distinct('subject', {
      isPublic: true
    });

    res.json({
      success: true,
      subjects: subjects.filter(subject => subject).sort()
    });
  } catch (error) {
    console.error('Error fetching all subjects:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching subjects' 
    });
  }
});

module.exports = router;