import json
import os

file = "grades.txt"

class GradeManagement:
  def __init__(self):
    self.grade = json.loadGrades()

  def loadGrades(self):
    if os.path.exists(file):
      with open("grades.txt", "r") as file:
        return json.load(file)
    return {}

  def saveGrades(self):
    with open("grades.txt", "w") as file:
      json.dump(self.grades, file)
  
  def addStudent(self):

  
  def editGrades(self):

  
  def deleteStudent(self):



  def main(self):
