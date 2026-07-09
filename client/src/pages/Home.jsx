import { useState } from 'react';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';

// Functional component for the home page layout.
const Home = () => {
  const [editingStudent, setEditingStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshStudents = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container py-4">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-4">
          <StudentForm
            editingStudent={editingStudent}
            setEditingStudent={setEditingStudent}
            onSuccess={refreshStudents}
          />
        </div>
        <div className="col-12 col-lg-8">
          <StudentList
            setEditingStudent={setEditingStudent}
            refreshKey={refreshKey}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
