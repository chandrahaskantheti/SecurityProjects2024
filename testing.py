import math
import random

# this program wil lbe used to calculate mathemtical quantities not regularly completed in 
# basic operations or functions. It will also attempt to run parallelization workflows to test integral 
# and differential based calculations. 

def calculusMain(x, y):
  return math.sin(x) * math.cos(y)

minX, maxX = 0, math.pi
minY, maxY = 0, math.pi / 2

n_sample = 100000

totalVal = 0

for _ in range(n_sample):
  xRand = random.uniform(minX, maxX)
  yRand = random.uniform(minY, maxY)
  totalVal += calculusMain(xRand, yRand)

print(totalVal)

area = (maxX - minX) * (maxY - minY)
integralVal = area * totalVal / n_sample
print(integralVal)