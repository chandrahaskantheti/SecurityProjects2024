'''class Fruit:
  def __init__(self, color, seedsCount):
    self.color = "red"
    self.numSeeds = 10

  def print_info(self): 
    print("Number of seeds: %d" % self.numSeeds)
    print("The color: %s" % self.color)

fruit = Fruit("red", 6)
fruit.print_info()

name = input("what your name? ") 
print("Hello %s" % name)'''

# Classes and Inheritance
'''
class Person:
  def __init__(self, fname, lname):
    self.firstname = fname
    self.lastname = lname

  def printname(self):
    print(self.firstname, self.lastname)

class Student(Person): 
  pass
student = Student("Mike", "Olsen")
student.printname()
'''
'''
class Person:
  def __init__(self, fname, lname):
    self.firstname = fname
    self.lastname = lname

  def printname(self):
    print(self.firstname, self.lastname)

class Student(Person):
  def __init__(self, fname, lname, year):
    super().__init__(fname, lname)
    self.graduationyear = year
  def welcome(self):
    print("Welcome", self.firstname, self.lastname, "to the class of", self.graduationyear)
mike = Student("Mike", "Olsen", 2019)
mike.welcome()
'''
'''
grades = {'John':'A', 'Emily':'A+', 'Betty':'B', 'Mike':'C', 'Ashley':'A', 'Edward':'C+'}
del(grades['Edward'])
grades.pop('Ashley')
print(grades) # {'Betty': 'A', 'Emily': 'A+', 'John': 'B', 'Mike': 'C', 'Sam': 'A'}
'''
'''
import json

grades_json = """{"John":"A", "Emily":"A+", "Betty":"B", "Mike":"C", "Ashley":"A"}"""
grades_dict = json.loads(grades_json)
print(grades_dict)

with open('data.json') as json_file:
  data = json.load(json_file)
  print(data)
'''

