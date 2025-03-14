from flask import Flask, jsonify, request, abort, send_from_directory
import os
import json

app =  Flask(__name__, static_folder = 'static')
gradeFile = "grades.json"

def loadGrades():
  if not os.path.exists(gradeFile):
    return {}
  with open(gradeFile, "r") as f:
    return json.load(f)

def saveGrades(grades):
  with open(gradeFile, "w") as f:
    json.dump(grades, f, indent=4)
  
grades = loadGrades()


@app.route('/grades', methods=['GET'])
def getGrades():
  return jsonify(grades)


@app.route('/grades/<name>', methods=['GET'])
def get_grades(name):
  if name in grades:
    return jsonify({name: grades[name]})
  else: 
    abort(404, description = "Student not found")


@app.route('/grades', methods=['POST'])
def addStudent():
  data = request.get_json()
  if not data or "name" not in data or "grade" not in data:
    abort(400, description = "Invalid input was entered")
  name = data["name"]
  gradeVal = data["grade"]

  if name in grades:
    abort(404, description = "This student name exists, no duplicates")
  
  grades[name] = gradeVal
  saveGrades(grades)
  return jsonify(grades), 201


@app.route('/grades/<name>', methods=['PUT'])
def updateStudent(name):
  if name not in grades:
    abort(404, description = "No Student was Found")
  
  data = request.get_json()
  if not data or "grade" not in data:
    abort(400, description = "Invalid input was entered")
  grades[name] = data["grade"]

  saveGrades(grades)
  return jsonify(grades)


@app.route('/grades/<name>', methods=['DELETE'])
def deleteStudent(name):
  if name not in grades:
    abort(404, description = "Student doesn't exist")
  
  del grades[name]
  saveGrades(grades)
  return jsonify(grades)

if __name__ == '__main__':
  app.run(debug=True)