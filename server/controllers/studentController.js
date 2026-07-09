const Student = require("../models/Student");

// Create a new student record.
const createStudent = async (req, res) => {
  try {
    const studentData = { ...req.body };

    // Save uploaded photo path
    if (req.file) {
      studentData.photo = `/uploads/${req.file.filename}`;
    }

    // Create student
    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all students with pagination
const getAllStudents = async (req, res) => {
  try {
    // Current page (Default = 1)
    const page = parseInt(req.query.page) || 1;

    // Records per page (Default = 5)
    const limit = parseInt(req.query.limit) || 5;

    // Number of records to skip
    const skip = (page - 1) * limit;

    // Fetch students
    const students = await Student.find()
      .skip(skip)
      .limit(limit);

    // Count total students
    const totalStudents = await Student.countDocuments();

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      totalStudents,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const studentData = { ...req.body };

    // Update uploaded photo
    if (req.file) {
      studentData.photo = `/uploads/${req.file.filename}`;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      studentData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export controllers
module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};