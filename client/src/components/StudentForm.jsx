import { useEffect, useState } from 'react';
import { getStoredUser } from '../services/authService';
import { createStudent, updateStudent } from '../services/studentService';

// Functional component for the student form.
const StudentForm = ({ editingStudent, setEditingStudent, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    age: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const user = getStoredUser();
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        email: editingStudent.email || '',
        course: editingStudent.course || '',
        age: editingStudent.age || '',
        photo: null,
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        email: '',
        course: '',
        age: '',
        photo: null,
      });
      setErrors({});
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handlePhotoChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      photo: e.target.files[0] || null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.course.trim()) newErrors.course = 'Course is required.';
    if (!formData.age) {
      newErrors.age = 'Age is required.';
    } else if (Number(formData.age) < 18) {
      newErrors.age = 'Age must be at least 18.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!isAdmin) {
      setError('Only administrators can create or update student records.');
      return;
    }

    if (!validateForm()) return;

    try {
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('email', formData.email);
      submissionData.append('course', formData.course);
      submissionData.append('age', formData.age);
      if (formData.photo) {
        submissionData.append('photo', formData.photo);
      }

      if (editingStudent) {
        await updateStudent(editingStudent._id, submissionData);
        setMessage('Student updated successfully');
      } else {
        await createStudent(submissionData);
        setMessage('Student created successfully');
      }

      setFormData({
        name: '',
        email: '',
        course: '',
        age: '',
        photo: null,
      });
      setErrors({});
      setEditingStudent(null);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save the student. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      course: '',
      age: '',
      photo: null,
    });
    setErrors({});
    setEditingStudent(null);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h4 className="card-title mb-3">{editingStudent ? 'Edit Student' : 'Add Student'}</h4>
        {!isAdmin && <div className="alert alert-warning">You can view students, but only admins can manage them.</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Course</label>
            <input
              type="text"
              className={`form-control ${errors.course ? 'is-invalid' : ''}`}
              name="course"
              value={formData.course}
              onChange={handleChange}
            />
            {errors.course && <div className="invalid-feedback">{errors.course}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              className={`form-control ${errors.age ? 'is-invalid' : ''}`}
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <div className="invalid-feedback">{errors.age}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Student Photo</label>
            <input type="file" className="form-control" accept="image/*" onChange={handlePhotoChange} />
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary" disabled={!isAdmin}>
              {editingStudent ? 'Update' : 'Submit'}
            </button>

            {editingStudent && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>

          {message && <div className="alert alert-success mt-3">{message}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
