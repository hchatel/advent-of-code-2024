from pathlib import Path
import time

useTestInput = False

fileName = "inputTest.txt" if useTestInput else 'input.txt'

f = open( Path(__file__).parent / fileName, "r")

inputLines = f.read().splitlines()

leftList = []
rightList = []

for line in inputLines:
    [a, b] = line.split('   ')
    leftList.append(int(a))
    rightList.append(int(b))

def solve1():
    timeStart = time.time()
    leftList.sort()
    rightList.sort()

    sum = 0
    for index in range(len(leftList)):
        sum += abs(leftList[index] - rightList[index])
    
    print('Solution 1: ', sum, 'in %.1f ms' % ((time.time() - timeStart) * 1000))


def solve2():
    timeStart = time.time()
    leftList.sort()
    rightList.sort()

    sum = 0
    for id in leftList:
        sum += id * rightList.count(id)
    
    print('Solution 2: ', sum, 'in %.1f ms' % ((time.time() - timeStart) * 1000))


solve1()
solve2()
