userInput = input("Enter two or more numbers: ")
  
numbersString = userInput.split()

if len(numbersString) < 2: 
  raise ValueError("There needs to be 2 or more numbers")
try:
  numbers = [float(num) for num in numbersString]
except ValueError:
  raise ValueError("Only Numbers can be present.")
  
sumTotal = sum(numbers)
print(sumTotal)
