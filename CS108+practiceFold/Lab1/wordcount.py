import string

def cleanWords(word):
  return word.lower().translate(str.maketrans("", "", string.punctuation))

file = "PythonSummary.txt"

fileWord = input("Enter a word to check for matches: ").strip().lower()
count = 0

with open("PythonSummary.txt", "r") as file:
  for line in file:
    words = line.split()
    for word in words:
      cleaned = cleanWords(word)
      count += cleaned.count(fileWord)
  print(f"The word '{fileWord}' occurs {count} times")
