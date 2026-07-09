import { useEffect, useMemo, useState } from 'react';
import { getAllStudents } from '../services/studentService';
import { getUsersCount } from '../services/authService';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentData, count] = await Promise.all([getAllStudents(), getUsersCount()]);
        setStudents(studentData);
        setUserCount(count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const recentStudents = useMemo(() => {
    return [...students].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [students]);

  const courseCount = useMemo(() => {
    return new Set(students.map((student) => student.course)).size;
  }, [students]);

  if (loading) {
    return <div className="container py-5 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Students</h6>
              <h3>{students.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Users</h6>
              <h3>{userCount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Courses</h6>
              <h3>{courseCount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Recent Students</h6>
              <h3>{recentStudents.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-3">Recently Added Students</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>{student.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
