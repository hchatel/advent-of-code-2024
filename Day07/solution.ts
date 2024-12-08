import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type InputLine = string;

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const inputLines: InputLine[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean);

// -------------------
// Your functions here
// -------------------

// Recursive test by computing the different combinations of the two first numbers,
// then calling the method again with updated array until there is only one
const checkCalculus = (
    expected: number,
    numbers: number[],
    withConcat: boolean = false,
): number => {
    if (numbers.length < 2) {
        return expected === numbers[0] ? expected : 0;
    }

    return checkCalculus(expected, [
        numbers[0] + numbers[1],
        ...numbers.slice(2),
    ], withConcat) ||
        checkCalculus(expected, [
            numbers[0] * numbers[1],
            ...numbers.slice(2),
        ], withConcat) ||
        (withConcat
            ? checkCalculus(expected, [
                +`${numbers[0]}${numbers[1]}`,
                ...numbers.slice(2),
            ], withConcat)
            : 0);
};

const checkLine = (line: string, withConcat: boolean = false): number => {
    const [expected, rest] = line.split(": ");
    const numbers = rest.split(" ").map((n) => +n);

    return checkCalculus(+expected, numbers, withConcat);
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () =>
    inputLines.reduce((sum, line) => sum + checkLine(line), 0);

const problem2: Solver = () =>
    inputLines.reduce((sum, line) => sum + checkLine(line, true), 0);

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 6083020304036 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 59002246504791 => Correct !
