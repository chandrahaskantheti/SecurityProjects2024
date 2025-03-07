import React, { useState, useEffect } from "react";

const API_url = "https://amhep.pythonanywhere.com/grades";

const Grades = () => {
  const [grades, setGrades] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [selectStudent, setSelectStudent] = useState("");
  const [studentGrade, setStudentGrade] = useState(null);

  const fetchGrades = async () => {
    try {
      const response = await fetch(API_url);
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      console.log("API Response:", data);
      
      const formattedGrades = Object.entries(data).map(([name, grade]) => ({
        name: name.replace("/", ""),
        grade: grade,
      }));
      setGrades(formattedGrades);
    }
    catch (error) {
      console.error("Error fetching grades:", error);
      setGrades([]);
    }
  };

  useEffect (() =>  {
    fetchGrades();
  }, []);

  const addStudent = async () => {
    try {
      const response = await fetch(API_url, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ name: studentName.replace("/", ""), grade: parseFloat(grade)}),
      });
      if (!response.ok) throw new Error("error adding student");
      fetchGrades();
    }
    catch (error) {
      console.error("Error with creating a student:", error);
    }
  };

  const updateStudentGrade = async () => {
    try {
      if (!selectStudent || !grade) return;
      const formattedName = encodeURIComponent(selectStudent.replace("/", ""));
      const response = await fetch(`${API_url}/${formattedName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({grade: parseFloat(grade)}),
      });
      if (!response.ok) throw new Error("Error updating grade");

      console.log()
      fetchGrades();
    }
    catch (error) {
      console.error("Error updating grade:", error);
    }
  };

  const deleteStudent = async () => {
    try {
      if (!selectStudent) return;

      const formattedName = encodeURIComponent(selectStudent.replace("/", ""));
      const response = await fetch(`${API_url}/${formattedName}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error with deleting student");
      fetchGrades();
    }
    catch (error) {
      console.error("Error deleting the student:", error);
    }
  };

  const fetchStudentGrades = async () => {
    try {
      if (!studentName.trim()) {
        alert("Please enter student name.");
        return;
      }
      const trimmedName = studentName.trim();
      let formattedName = encodeURIComponent(trimmedName);
      let response = await fetch(`${API_url}/${formattedName}`);

      if (!response.ok && trimmedName[0] !== "/") {
        formattedName = encodeURIComponent("/" + trimmedName);
        response = await fetch(`${API_url}/${formattedName}`);
      }

      if (!response.ok) throw new Error("No such student found");

      const data = await response.json();

      let gradeVal = data;
      if (typeof data === "object" && data !== null) {
        gradeVal = Object.values(data)[0];
      }

      setStudentGrade(gradeVal);
    }
    catch (error) {
      console.error("Errror fetching student's grade:", error);
      setStudentGrade("Not Found");
    }
  };

  
  

  return (
    <div>
      <h1> Grades Management</h1>

      <div> 
        <h3>All Students</h3>
        <button onClick={fetchGrades}>Refresh Student List</button>
        <ul>
          {grades.length > 0 ? (
            grades.map((student, index) => (
              <li key = {index}>
                {student.name}: {student.grade}
              </li>
            ))
          ) : (
            <p>No grades found</p>
          )}
        </ul>
      </div>

      <div>
        <h3>Get Student Grade</h3>
        <input type="text" placeholder="Student Name (Case-Senstive)" value={studentName} onChange={(e) => setStudentName(e.target.value)}/>
        <button onClick = {fetchStudentGrades}>Get student Grade</button>

        {studentGrade !== null && (
          <p>Grade for {studentName}: <strong>{studentGrade}</strong></p>
        )}
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