# Solution found online: https://youtu.be/ym1ae-vBy6g?si=4zZHekv7FU6WguGi

from pathlib import Path
import time
from collections import Counter

useTestInput = False

fileName = "inputTest.txt" if useTestInput else 'input.txt'

f = open( Path(__file__).parent / fileName, "r")

input = f.read().strip()

lines = input.split('\n')

leftList = []
rightList = []
rightIdCount = Counter()

for line in lines:
    [leftId, rightId] = line.split()
    leftId = int(leftId)
    rightId = int(rightId)
    leftList.append(leftId)
    rightList.append(rightId)
    rightIdCount[rightId] += 1

leftList = sorted(leftList)
rightList = sorted(rightList)


def solve1():
    timeStart = time.time()

    sum = 0
    for left, right in zip(leftList, rightList):
        sum += abs(left - right)
    
    print('Solution 1: ', sum, 'in %.1f ms' % ((time.time() - timeStart) * 1000))


def solve2():
    timeStart = time.time()

    sum = 0
    for leftId in leftList:
        sum += leftId * rightIdCount.get(leftId, 0)
    
    print('Solution 2: ', sum, 'in %.1f ms' % ((time.time() - timeStart) * 1000))


solve1()
solve2()
