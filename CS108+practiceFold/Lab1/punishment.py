pPhrase = input("User enter their punishment phrase: ")
pReps = int(input("User enter number of repeats: "))
file = open("CompletedPunishment.txt", "w")
for i in range(pReps):
  with open("CompletedPunishment.txt", "a") as file:
    file.write(pPhrase + "\n")
    i = i + 1