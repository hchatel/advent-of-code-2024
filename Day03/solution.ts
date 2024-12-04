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
const inputLines: InputLine = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
);

// -------------------
// Your functions here
// -------------------

const regexMul = /mul\((\d{1,3}),(\d{1,3})\)/gm;
const regexMulDoDont = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/gm;

// First approach

const extractAndMultiply = (lines: string[]) =>
    lines.reduce((productSum, line) => {
        let lineProductSum = 0;

        for (const match of line.matchAll(regexMul)) {
            lineProductSum += +match[1] * +match[2];
        }

        return productSum + lineProductSum;
    }, 0);

// Second approach: Do not split input

const extractAndMultiply2 = (text: string) =>
    [...text.matchAll(regexMul)].reduce((productSum, match) => productSum + +match[1] * +match[2], 0);

const extractAndMultiplyConditionnaly2 = (text: string) => {
    let doMul = true;

    return [...text.matchAll(regexMulDoDont)].reduce((productSum, match) => {
        if (match[0] === "do()") {
            doMul = true;
        } else if (match[0] === "don't()") {
            doMul = false;
        } else if (doMul) {
            return productSum + +match[1] * +match[2];
        }

        return productSum;
    }, 0);
};

// Third approach: loop using "for .. of" instead of "[... ].reduce"
// => Execution time is roughly the same

const extractAndMultiply3 = (text: string) => {
    let sum = 0;

    for (const match of text.matchAll(regexMul)) {
        sum += +match[1] * +match[2];
    }

    return sum;
};

const extractAndMultiplyConditionnaly3 = (text: string) => {
    let doMul = true;
    let sum = 0;

    for (const match of text.matchAll(regexMulDoDont)) {
        if (match[0] === "do()") {
            doMul = true;
        } else if (match[0] === "don't()") {
            doMul = false;
        } else if (doMul) {
            sum += +match[1] * +match[2];
        }
    }

    return sum;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => extractAndMultiply3(inputLines);

const problem2: Solver = () => extractAndMultiplyConditionnaly3(inputLines);

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 161085926 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 83950340 => Too high :(
// I was scanning lines independently with "doMul" set to true at each line beginning,
// although it was supposed to be kept after line break.
// => Extract doMul outside the loop over line matches

// - 82045421 => Correct !

// => Refactor code to not loop over lines but to scan text as a whole
