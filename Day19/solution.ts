import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const [towelsRaw, patternsRaw] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n\n");

const towels = towelsRaw.split(", ");
const patterns = patternsRaw.split("\n").filter(Boolean);

// -------------------
// Your functions here
// -------------------

// First approach
// For part2, I tried to modify it to return a count rather than a boolean
// => Works well with small inputs, but grow exponentially.
const checkPattern = (fullPattern: string): boolean => {
    const patterns: string[] = [];
    let pattern: string | undefined = fullPattern;

    while (pattern) {
        for (const towel of towels) {
            if (pattern.startsWith(towel)) {
                if (pattern.length === towel.length) {
                    return true;
                }

                patterns.push(pattern.substring(towel.length));
            }
        }

        pattern = patterns.pop();
    }

    return false;
};

// Second approach
// Although I had the look-up table in mind, I wanted to try a recursive implementation
// It is quite similar to the first approach in terms of complexity / time of execution
// I finally did the LUT optimization, giving a blazingly fast result:
// => About 100ms for the full input, compared to... Still stuck on first line after several minutes
const arrangmentsMap = new Map<string, number>();

const countArrangements = (pattern: string): number => {
    let count = 0;
    if (arrangmentsMap.has(pattern)) {
        return arrangmentsMap.get(pattern)!;
    }

    for (const towel of towels) {
        if (pattern.startsWith(towel)) {
            // console.log("   => startsWith", towel);
            if (pattern.length === towel.length) {
                count++;
            } else {
                count += countArrangements(pattern.substring(towel.length));
            }
        }
    }

    arrangmentsMap.set(pattern, count);

    return count;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => patterns.reduce((sum, pattern) => sum + (checkPattern(pattern) ? 1 : 0), 0);
const problem2: Solver = () => patterns.reduce((sum, pattern) => sum + countArrangements(pattern), 0);

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 342 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 891176573846860 => Too low
// => I modified the input for a test and forgot to roll back to original input *facepalm*
// - 891192814474630 => Correct !
