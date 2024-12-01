import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type InputLine = string;

// Switch inputs here
const USE_TEST_INPUT = false;

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const inputLines: InputLine[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n");

const leftList: number[] = [];
const rightList: number[] = [];

for (const line of inputLines) {
    const [left, right] = line.split("   ");
    if (left && right) {
        leftList.push(+left);
        rightList.push(+right);
    }
}

// -------------------
// Your functions here
// -------------------

// Problem 2

// First approach:
// - Sort lists
// - Incrementally browse each list to avoid repetitive checks
const incrementalBrowse = (): number => {
    const leftListSorted = leftList.sort();
    const rightListSorted = rightList.sort();

    let similaritySum = 0;

    for (
        let leftIndex = 0, rightIndex = 0;
        leftIndex < leftListSorted.length;
        leftIndex++
    ) {
        const id = leftListSorted[leftIndex];

        // Count number of left id occurrences
        let leftOcc = 1;
        while (
            leftIndex < leftListSorted.length - 1 &&
            leftListSorted[leftIndex + 1] === id
        ) {
            leftIndex++;
            leftOcc++;
        }

        // Find and count similar id in right list
        let rightOcc = rightListSorted[rightIndex] === id ? 1 : 0;
        while (
            rightIndex < rightListSorted.length - 1 &&
            rightListSorted[rightIndex + 1] <= id
        ) {
            rightIndex++;
            if (rightListSorted[rightIndex] === id) {
                rightOcc++;
            }
        }

        similaritySum += leftOcc * rightOcc * id;
    }

    return similaritySum;
};

// Second approach :
// - Most concise and readable solution
// - Maybe less efficient
const quickAndDirty = (): number =>
    leftList.reduce(
        (sum, leftId) =>
            sum += leftId *
            rightList.filter((rightId) => rightId === leftId).length,
        0,
    );

// -------------
// Solve problem
// -------------

export const problem1: Solver = () => {
    const leftListSorted = leftList.sort();
    const rightListSorted = rightList.sort();

    return leftListSorted.reduce(
        (sum, id, index) => sum + Math.abs(id - rightListSorted[index]),
        0,
    );
};

export const problem2 = () => {
    return incrementalBrowse(); // 1.04ms

    // return quickAndDirty(); // 10.7ms
};

// ---------------
// Display answers
// ---------------

// solveWithLogs(problem1, 1);
// Tries :
// - 1222801 => Correct !

solveWithLogs(problem2, 2);
// Tries :
// - 22545250 => Correct !
