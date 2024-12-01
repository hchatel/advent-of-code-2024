import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type InputLine = string;

// Switch inputs here
const USE_TEST_INPUT = true;

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const inputLines: InputLine[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n");

// -------------------
// Your functions here
// -------------------

// -------------
// Solve problem
// -------------

export const problem1: Solver = () => {
    console.log("Input lines: ", inputLines);

    return "This problem ain't gonna solve itself !";
};

// const problem2: Solver = () => myFunction(TEST_INPUT);

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);

// solveWithLogs(problem2, 2);
