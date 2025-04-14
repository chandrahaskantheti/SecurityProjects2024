import React, { useState } from 'react';

function GradeTable({ students, onGradeChange }) {
  const [newGrades, setNewGrades] = useState({});

  const validateGrade = (grade) => {
    const num = Number(grade);
    return !(isNaN(num) || num < 0 || num > 100);
  };

  const isDisabledInput = (student) => {
    const newGrade = newGrades[student.enrollment_id];
    const currentGrade = student.grade ?? '';
  
    return (
      newGrade === undefined ||
      newGrade === '' ||
      Number(newGrade) === Number(currentGrade)
    );
  };
  
  const handleInputChange = (studentId, value) => {
    setNewGrades((prevGrades) => {
      const updatedGrades = { ...prevGrades };
      updatedGrades[studentId] = value;
      return updatedGrades;
    });

  };

  const handleSave = (student) => {
    const currentGrade = student.grade ?? '';
    const enrollmentID = student.enrollment_id;
    const newGrade = newGrades[student.enrollment_id];

    if (newGrade !== '' && newGrade !== undefined && newGrade !== String(currentGrade)) {
      onGradeChange(enrollmentID, newGrade);
    }
  };

  return (
    <table className="course-table">
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Current Grade</th>
          <th>New Grade</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.first_name} {student.last_name}</td>
            <td>{student.grade ?? '—'}</td>
            <td>
              <input
                type="number"
                placeholder="Enter new grade"
                value={newGrades[student.enrollment_id] ?? ''}
                onChange={(e) => handleInputChange(student.enrollment_id, e.target.value)}
              />
            </td>
            <td>
              <button
                onClick={() => handleSave(student)}
                disabled={
                  isDisabledInput(student) ||
                  !validateGrade(newGrades[student.enrollment_id])
                }
                className="save-button"
              >
                Save
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GradeTable;
