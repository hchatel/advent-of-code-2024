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

// -------------------
// Your functions here
// -------------------

const checkIsSafeReport = (levels: number[]): boolean => {
    const inc = levels[0] < levels[1] ? 1 : -1;

    for (let i = 1; i < levels.length; i++) {
        const diff = inc * (levels[i] - levels[i - 1]);
        if (diff < 1 || diff > 3) {
            return false;
        }
    }

    return true;
};

const checkReportWithTolerance = (
    levels: number[],
): boolean => levels.some((_, index) => checkIsSafeReport(levels.filter((_, i) => i !== index)));

// First approach
const countSafeReports = (reports: string[], withTolerance = false) =>
    reports.reduce((count, report) => {
        if (!report) return count;

        const levels = report.split(" ").map((str) => +str);

        const isSafe = withTolerance ? checkReportWithTolerance(levels) : checkIsSafeReport(levels);

        return count + +isSafe;
    }, 0);

// -------------
// Solve problem
// -------------

export const problem1: Solver = () => {
    return countSafeReports(inputLines);
};

const problem2: Solver = () => {
    return countSafeReports(inputLines, true);
};

// ---------------
// Display answers
// ---------------

// solveWithLogs(problem1, 1);
// Tries:
// - 257 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 325 => Too low :(
// - 328 => Correct !
