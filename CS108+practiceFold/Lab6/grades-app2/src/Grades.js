import React, { useState, useEffect } from "react";

const API_url = "http://127.0.0.1:5000/grades";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [getName, setGetName] = useState("");
  const [get_grade,setGet_grade] = useState(null);
  const [addName, setAddName] = useState("");
  const [addGrade, setAddGrade] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateStudent, setUpdateStudent] = useState("");
  const [deleteName, setDeleteName] = useState("");

  const fetchGrades = async () => {
    try {
      const response = await fetch(API_url);
      if (!response.ok) throw new Error("Network error");

       let textData = await response.text();
      console.log("RAW API Response:", textData); 

      textData = textData.replace(/NaN/g, "null");
      textData = textData.replace(/([{,])(\d+)(:)/g, '$1"$2"$3'); 
      // Convert number keys to strings
      const data = JSON.parse(textData);
      
      const formattedGrades = Object.entries(data)
        .filter(([name, grade]) => grade !== null && !isNaN(grade))
        .map(([name, grade]) => ({
        name: `"${String(name).trim().replace(/\0/g, '')}"`,
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
        body: JSON.stringify({ name: addName.replace("/", ""), grade: parseFloat(addGrade)}),
      });
      if (!response.ok) throw new Error("error adding student");
      await fetchGrades();
      alert(`Student ${addName} added successfully.`);
    }
    catch (error) {
      console.error("Error with creating a student:", error);
      alert("Error adding student");
    }
  };

  const updateStudentGrade = async () => {
    try {
      if (!updateName || !updateStudent) return;
      const formattedName = encodeURIComponent(updateName.replace("/", ""));
      const response = await fetch(`${API_url}/${formattedName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({grade: parseFloat(updateStudent)}),
      });
      if (!response.ok) throw new Error("Error updating grade");

      console.log()
      await fetchGrades();
      alert(`${updateName} grade changed successfully!`);
    }
    catch (error) {
      console.error("Error updating grade:", error);
      alert("error updating student");
    }
  };

  const deleteStudent = async () => {
    try {
      if (!deleteName) return;

      const formattedName = encodeURIComponent(deleteName.replace("/", ""));
      const response = await fetch(`${API_url}/${formattedName}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error with deleting student");
      await fetchGrades();
      alert(`Deleted ${deleteName} Successfully!`);
    }
    catch (error) {
      console.error("Error deleting the student:", error);
      alert("error deleting student");
    }
  };

  const fetchStudentGrades = async () => {
    try {
      if (!getName.trim()) {
        alert("Please enter student name.");
        return;
      }
      const trimmedName = getName.trim();
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

      setGet_grade(gradeVal);
    }
    catch (error) {
      console.error("Errror fetching student's grade:", error);
      setGet_grade("Not Found");
      alert("Error fetching grade.");
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
        <input type="text" placeholder="Student Name (Case-Senstive)" value={getName} onChange={(e) => setGetName(e.target.value)}/>
        <button onClick = {fetchStudentGrades}>Get student Grade</button>

        {get_grade !== null && (
          <p>Grade for {getName}: <strong>{get_grade}</strong></p>
        )}
      </div>
      
      <div>
        <h3>Add Student</h3>
        <input type="text" placeholder="Student Name" value={addName} onChange={(e) => setAddName(e.target.value)}/>
        <input type="number" placeholder="Grade" value={addGrade} onChange={(e) => setAddGrade(e.target.value)}/>
        <button onClick={addStudent}>Add Student</button>
      </div>

      <div>
      <h3>Update Student Grade</h3>
        <input type="text" placeholder="Student Name" value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
        <input type="number" placeholder="New Grade" value={updateStudent} onChange={(e) => setUpdateStudent(e.target.value)}/>
        <button onClick={updateStudentGrade}>Update Grade</button>
      </div>

      <div>
        <h3>Delete The Student</h3>
        <input type="text" placeholder="Student Name" value={deleteName} onChange={(e) => setDeleteName(e.target.value)}/>
        <button onClick={deleteStudent}>Delete Student</button>
      </div>

    </div>
  );
};

export default Grades;