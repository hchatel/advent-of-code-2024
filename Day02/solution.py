from pathlib import Path
import time

useTestInput = False

fileName = "inputTest.txt" if useTestInput else 'input.txt'

f = open( Path(__file__).parent / fileName, "r")

input = f.read().strip()

lines = input.split('\n')

def checkLevels(levels):
    inc = 1 if int(levels[0]) < int(levels[1]) else -1

    for index in range(len(levels) - 1):
        diff = inc * (int(levels[index+ 1]) - int(levels[index]))
        if diff < 1 or diff > 3:
            return False

    return True

def solve1():
    timeStart = time.time()

    count = 0

    for line in lines:
        levels = line.split()
        
        count += 1 if checkLevels(levels) else 0
    
    print('Solution 1: ', count, 'in %.1f ms' % ((time.time() - timeStart) * 1000))


# Almost work... but don't
def solve2():
    timeStart = time.time()

    count = 0
    lineNb = 1

    for line in lines:
        print(lineNb, line)
        lineNb += 1
        levels = line.split()
        safe = False
        index = 0
        while not safe and index < len(levels):
            shortLevels = levels[:]
            shortLevels.remove(shortLevels[index])
            safe = checkLevels(shortLevels)
            index += 1
        
        count += int(safe)

    
    print('Solution 2: ', count, 'in %.1f ms' % ((time.time() - timeStart) * 1000))


solve1()
solve2() # Not quite the right result :/ 
