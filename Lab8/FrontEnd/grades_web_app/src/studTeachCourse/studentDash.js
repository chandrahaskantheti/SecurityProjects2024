import React, {useEffect, useState} from 'react';
import CourseTable from '../webComponents/courseTable';
import Header from '../webComponents/helper/Header';

function StudentDashboard({ user, onLogout }) {
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const fetchCourses = async () => {
    const studentResponse = await fetch('/api/student/classes', { credentials: 'include' });
    const studentData = await studentResponse.json();
    
    const classResponse = await fetch('/api/classes', { credentials: 'include' });
    const classData = await classResponse.json();
    
    setMyCourses(studentData.classes);
    setAllCourses(classData.classes);    
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const enroll = async (id) => {
    await fetch('/api/student/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ class_id: id })
    });
    fetchCourses();
  };

  const unenroll = async (id) => {
    await fetch('/api/student/unenroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: id })
    });
    fetchCourses();
  };

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <h3>Your Courses</h3>
      <CourseTable courses={myCourses} isStudent={false} />
      <h3>Available Courses</h3>
      <CourseTable courses={allCourses} studentCourses={myCourses} onAdd={enroll} onRemove={unenroll} isStudent={true} />
    </div>
  );
}

export default StudentDashboard;