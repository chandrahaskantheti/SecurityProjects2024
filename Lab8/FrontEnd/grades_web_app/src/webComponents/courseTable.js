import React from "react";

function CourseTable({ courses, studentCourses = [], onAdd, onRemove, onEdit, isStudent }) {

  const actionTooltip = (course, isStudentEnrolled) => {
    if (isStudentEnrolled) return "Unenroll";
    if (course.enrolled_count >= course.capacity) return "Class is full";
    return "Enroll";
  };

  
  const getEnrolledClass = (course) => {
    const ratio = course.enrolled_count / course.capacity;
    if (ratio >= 0.9) return "enrolled-full";
    if (ratio >= 0.6) return "enrolled-medium";
    return "enrolled-low";
  };
  
  return (
    <table className="course-table">
      <thead>
        <tr>
          <th className="col-name">Name</th>
          <th className="col-teacher">Teacher</th>
          <th className="col-time">Time</th>
          <th className="col-enrolled">Enrolled</th>
          {isStudent && <th className="col-action">Action</th>}
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => {
          const isStudentEnrolled = studentCourses.some(c => c.id === course.id);

          return (
            <tr key={course.id}>
              <td>{course.class_name}
              {onEdit && (
                <button
                  className="view-students-button"
                  onClick={() => onEdit(course.id)}
                  title="View Students"
                >
                  👁️
                </button>
              )}
            </td>
              <td>{course.teacher_name}</td>
              <td>{course.course_time}</td>
              <td className={getEnrolledClass(course)}>
                {course.enrolled_count}/{course.capacity}
              </td>
              {isStudent && (
                <td className="col-action">
                  <button
                    className={`action-button ${isStudentEnrolled ? "remove" : "add"}`}
                    onClick={() =>
                      isStudentEnrolled ? onRemove(course.id) : onAdd(course.id)
                    }
                    disabled={!isStudentEnrolled && course.enrolled_count >= course.capacity}
                    title={actionTooltip(course, isStudentEnrolled)}
                  >
                    {isStudentEnrolled ? "-" : "+"}
                  </button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}


export default CourseTable;

