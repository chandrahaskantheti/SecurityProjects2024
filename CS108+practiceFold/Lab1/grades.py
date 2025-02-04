import json
import os

gradeFile = "grades.txt"

class GradeManagement:
  def __init__(self):
    self.grades = self.loadGrades()

  def loadGrades(self):
    if os.path.exists(gradeFile):
      with open(gradeFile, "r") as file:
        return json.load(file)
    return {}

  def saveGrades(self):
    with open(gradeFile, "w") as file:
      json.dump(self.grades, file, indent = 4)
  
  def addStudent(self):
    studentName = input("Please enter Full Name of Student: ").strip()
    if studentName in self.grades:
      print("Duplicate name found. Use Edit Function or Change Name.")
      return
    try:
      studentGrade = float(input("Enter Student's Grade: ").strip())
      self.grades[studentName] = studentGrade
      self.saveGrades()
      print("Student Added.")
    except ValueError:
      print("Student Grade inputted incorrectly.")

  def getGrades(self):
    student = input("Enter full name of the Student: ").strip()
    if student in self.grades:
      print(f"{student} has grade: {self.grades[student]}") # idk, could add decimals to return Grade percenage as float
    else:
      print("Student of such name doesn't exist.")
  
  def deleteStudent(self):
    student = input("Enter full name of Student to remove: ").strip()
    if student in self.grades:
      del self.grades[student]
      self.saveGrades()
      print(f"Deleted Student {student} from Grade Management.")
    else:
      print(f"Student {student} not found.")

  def editGrades(self):
    student = input("Enter full name of Student to edit: ").strip()
    if student in self.grades:
      try:
        newGrades = float(input(f"Enter new grade for {student}: ").strip())
        self.grades[student] = newGrades
        self.saveGrades()
        print(f"{student} new grade saved to {self.grades[student]:.2f}")
      except ValueError:
        print("Incorrect/Invalid input grade entered.")
    else:
      print(f"{student} not found.")


  def menu(self):
    while True:
      print("\nGrade Management System")
      print("1. Add Student Grade. ")
      print("2. Get Student's Grade. ")
      print("3. Edit Student's Grade. ")
      print("4. Delete Student. ")
      print("5. Exit Grades System. ")

      options = input("Choose an option: ").strip()

      if options == "1":
        self.addStudent()
      elif options == "2":
        self.getGrades()
      elif options == "3":
        self.editGrades()
      elif options == "4":
        self.deleteStudent()
      elif options == "5":
        print("Grades are saved. Exiting System. ")
        break
      else: 
        print("Invalid Choice, enter an option that is listed. ")

if __name__ == "__main__":
  grades_manage = GradeManagement()
  grades_manage.menu()