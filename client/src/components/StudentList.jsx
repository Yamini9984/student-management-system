import { useEffect, useState } from 'react';
import { getStoredUser } from '../services/authService';
import { deleteStudent, getAllStudents } from '../services/studentService';

// Functional component for displaying all students.
const StudentList = ({ setEditingStudent, refreshKey }) => {
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const user = getStoredUser();
  const isAdmin = user?.role === 'Admin';
  const pageSize = 6;

  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load students right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, courseFilter, sortBy]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this student?');

    if (!confirmed) return;

    setMessage('');
    setError('');

    try {
      await deleteStudent(id);
      setMessage('Student deleted successfully');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete the student. Please try again.');
    }
  };

  const filteredStudents = [...students]
    .filter((student) => {
      const search = searchText.toLowerCase();
      const matchesSearch = !search || [student.name, student.email, student.course].some((value) => value?.toLowerCase().includes(search));
      const matchesCourse = !courseFilter || student.course?.toLowerCase() === courseFilter.toLowerCase();
      return matchesSearch && matchesCourse;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'age-asc':
          return a.age - b.age;
        case 'age-desc':
          return b.age - a.age;
        case 'course-asc':
          return a.course.localeCompare(b.course);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const visibleStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const courseOptions = [...new Set(students.map((student) => student.course).filter(Boolean))];

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h4 className="card-title mb-3">Student List</h4>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or course"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="">All Courses</option>
              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="age-asc">Age Asc</option>
              <option value="age-desc">Age Desc</option>
              <option value="course-asc">Course A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : visibleStudents.length === 0 ? (
          <div className="alert alert-info text-center">No matching students found.</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Age</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((student) => (
                    <tr key={student._id}>
                      <td>
                        {student.photo ? (
                          <img src={`http://localhost:5000${student.photo}`} alt={student.name} className="rounded" width="48" height="48" style={{ objectFit: 'cover' }} />
                        ) : (
                          <span className="text-muted">No photo</span>
                        )}
                      </td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>{student.age}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setEditingStudent(student)}
                            disabled={!isAdmin}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(student._id)}
                            disabled={!isAdmin}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted">Page {currentPage} of {totalPages}</span>
              <div className="btn-group">
                <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
                  Previous
                </button>
                <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentList;
