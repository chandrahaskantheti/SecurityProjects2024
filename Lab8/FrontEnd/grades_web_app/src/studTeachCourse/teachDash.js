import React, {useEffect, useState} from 'react';
import GradeTable from '../webComponents/gradesTable';
import CourseTable from '../webComponents/courseTable';
import Header from '../webComponents/helper/Header';


function TeacherDashboard({user, onLogout}) {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setSCurrentCourse] = useState(null);
  const [students, setStudents] = useState([]);

  const fetchCourses = async () => {
    const teacherResponse = await fetch('/api/teacher/classes', { credentials: 'include' });
    const teacherData = await teacherResponse.json();

    setCourses(teacherData.classes || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const selectCourse = async (courseId) => {
    setSCurrentCourse(courseId);
    const res = await fetch(`/api/classes/${courseId}`, { credentials: 'include' });
    const data = await res.json();
    setStudents(data.class.students || []);
  };

  const updateGrade = async (studentId, grade) => {
    await fetch(`/api/teacher/grades/${studentId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({ grade })
    });
    selectCourse(currentCourse);
  };

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <h3>Your Courses</h3>
      <CourseTable
        courses={courses}
        isStudent={false}
        onEdit={selectCourse}
      />
      {currentCourse && (
        <div>
          <h3> Students and Grades</h3>
          <GradeTable students={students} onGradeChange={updateGrade} />
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard