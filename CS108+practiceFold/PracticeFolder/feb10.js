import React, { useState, useEffect } from "react";

const API_url = "https://amhep.pythonanywhere.com/grades";

const Grades = () => {
  const [grades, setGrades] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [selectStudent, setSelectStudent] = useState("");

  const fetchGrades = async () => {
    try {
      const response = await fetch(API_url);
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      console.log("API Response:", data);
      setGrades(Array.isArray(data) ? data : []);
    }
    catch (error) {
      console.error("Error fetching grades:", error);
      setGrades([]);
    }
  };

  useEffect (() =>  {
    fetchGrades();
  }, []);


  const fetchStudentGrades = async () => {
    try {
      if (!studentName) return;
      const response = await fetch(`${API_url}/${encodeURIComponent(studentName)}`);
      const data = await response.json();
      alert(`Student ${studentName} grades are: ${JSON.stringify(data)}`);
    }
    catch (error) {
      console.error("Error fetching the student's grade:", error);
    }
  };

  const addStudent = async () => {
    try {
      const response = await fetch(API_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: studentName, grade: parseFloat(grade)}),
      });
      const data = await response.json();
      setGrades(data);
    }
    catch (error) {
      console.error("Error with creating a student:", error);
    }
  };

  const updateStudentGrade = async () => {
    try {
      if (!selectStudent || !grade) return;
      const response = await fetch(`${API_url}/${encodeURIComponent(selectStudent)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({grade: parseFloat(grade)}),
      });
      const data = await response.json();
      setGrades(data);
    }
    catch (error) {
      console.error("Error updating grade:", error);
    }
  };

  const deleteStudent = async () => {
    try {
      if (!selectStudent) return;
      const response = await fetch(`${API_url}/${encodeURIComponent(selectStudent)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setGrades(data);
    }
    catch (error) {
      console.error("Error deleting the student:", error);
    }
  };

  return (
    <div>
      <h1> Grades Management</h1>

      <div> 
        <h3>All Students</h3>
        <button onClick={fetchGrades}>Refresh Student List</button>
        <ul>
          {Array.isArray(grades) && grades.length > 0 ? (
            grades.map((student, index) => (
              <li key={index}>
                {student.name}: {student.grade}
              </li>
            ))
          ) : (
            <p> No grades found</p>
          )}
        </ul>
      </div>
      
      <div>
        <h3>Get Grade of Student</h3>
        <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)}/>
        <button onClick={fetchStudentGrades}>Get Student Grade</button>
      </div>
      
      <div>
        <h3>Add Student</h3>
        <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)}/>
        <input type="number" placeholder="Grade" value={grade} onChange={(e) => setGrade(e.target.value)}/>
        <button onClick={addStudent}>Add Student</button>
      </div>

      <div>
      <h3>Update Student Grade</h3>
        <input type="text" placeholder="Student Name" value={selectStudent} onChange={(e) => setSelectStudent(e.target.value)}/>
        <input type="number" placeholder="New Grade" value={grade} onChange={(e) => setGrade(e.target.value)}/>
        <button onClick={updateStudentGrade}>Update Grade</button>
      </div>

      <div>
        <h3>Delete The Student</h3>
        <input type="text" placeholder="Student Name" value={selectStudent} onChange={(e) => setSelectStudent(e.target.value)}/>
        <button onClick={deleteStudent}>Delete Student</button>
      </div>

    </div>
  );
};

export default Grades;