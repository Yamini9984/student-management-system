const express = require('express');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Create a router instance for student-related routes.
const router = express.Router();

// Protect the student routes and allow only admins to mutate student records.
router.use(protect);

// Route: POST /students -> create a new student.
router.post('/', authorizeRoles('Admin'), upload.single('photo'), createStudent);

// Route: GET /students -> get all students.
router.get('/', getAllStudents);

// Route: GET /students/:id -> get one student by ID.
router.get('/:id', getStudentById);

// Route: PUT /students/:id -> update a student by ID.
router.put('/:id', authorizeRoles('Admin'), upload.single('photo'), updateStudent);

// Route: DELETE /students/:id -> delete a student by ID.
router.delete('/:id', authorizeRoles('Admin'), deleteStudent);

// Export the router so it can be mounted in the main server file.
module.exports = router;
