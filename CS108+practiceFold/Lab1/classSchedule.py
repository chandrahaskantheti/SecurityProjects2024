class Schedule:
  def __init__(self, department, number, name, credits, days, startTime, endTime, averageG):
    self.department = department
    self.number = number
    self.name = name
    self.credits = credits
    self.days = days
    self.startTime = startTime
    self.endTime = endTime
    self.averageG = averageG

  def courseLayout(self, indexCourse):
    # this will format the course details as required. 
    return (f"COURSE {indexCourse}: {self.department}{self.number}: {self.name}\n"
            f"Number of Credits: {self.credits}\n"
            f"Days of Lectures: {self.days}\n"
            f"Lecture Time: {self.startTime} - {self.endTime}\n"
            f"Stat: on average, students get {self.averageG}% in this course\n\n")
  
with open("classesInput.txt", "r") as file:
  lines = [line.strip() for line in file.readlines()]

numberCourses = int(lines[0])
courseList = []

index = 1
for i in range(1, numberCourses + 1):
  department = lines[index]
  number = lines[index + 1]
  name = lines[index + 2]
  credits = lines[index + 3]
  days = lines[index + 4]
  startTime = lines[index + 5]
  endTime = lines[index + 6]
  averageG = lines[index + 7]

  courseObj = Schedule(department, number, name, credits, days, startTime, endTime, averageG)
  courseList.append(courseObj)

  index += 8
outputText = ""
for id, courseObj in enumerate(courseList, start = 1):
  outputText += courseObj.courseLayout(id)

with open("classesOutput.txt", "w") as outfile:
  outfile.write(outputText)
