import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type InputMap = number[][];

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const inputMap: InputMap = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean).map((line) => line.split("").map(Number));

// -------------------
// Your functions here
// -------------------

interface TrailStep {
    i: number;
    j: number;
    height: number;
}

const countTrailheadScore = (
    map: InputMap,
    startI: number,
    startJ: number,
): [number, number] => {
    const tops = new Set();
    let distinctTrailsCount = 0;

    const trailSteps: TrailStep[] = [{ i: startI, j: startJ, height: 0 }];

    while (trailSteps.length) {
        // Pop trail step from the pool and search for next possible steps
        const trailStep = trailSteps.pop()!;
        const height = trailStep.height + 1;

        for (const [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const i = trailStep.i + di;
            const j = trailStep.j + dj;

            if (
                i >= 0 && i < map.length && j >= 0 && j < map[0].length &&
                map[i][j] === height
            ) {
                if (height === 9) {
                    // Top reached, update tops / trailCount
                    tops.add(JSON.stringify([i, j]));
                    distinctTrailsCount++;
                } else {
                    // Add step back to the search pool
                    trailSteps.push({ i, j, height });
                }
            }
        }
    }

    return [tops.size, distinctTrailsCount];
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    let scoreSum = 0;
    for (let i = 0; i < inputMap.length; i++) {
        for (let j = 0; j < inputMap[0].length; j++) {
            if (inputMap[i][j] === 0) {
                scoreSum += countTrailheadScore(inputMap, i, j)[0];
            }
        }
    }

    return scoreSum;
};

const problem2: Solver = () => {
    let scoreSum = 0;
    for (let i = 0; i < inputMap.length; i++) {
        for (let j = 0; j < inputMap[0].length; j++) {
            if (inputMap[i][j] === 0) {
                scoreSum += countTrailheadScore(inputMap, i, j)[1];
            }
        }
    }

    return scoreSum;
};

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 776 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 1657 => Correct !
