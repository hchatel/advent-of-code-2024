import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type CharMap = string[][];

// Switch inputs here
const USE_TEST_INPUT = false;

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const inputMap: CharMap = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").map((line) => line.split(""));
// Remove last line if empty
if (!inputMap[inputMap.length - 1].length) inputMap.pop();

// -------------------
// Your functions here
// -------------------

// First approach:
// 1 - Search for X
// 2 - Search in any direction for the next letters

const localXMASSearch = (
    charMap: CharMap,
    startI: number,
    startJ: number,
): number => {
    const XMAS = "XMAS";
    // Increments for each 8 directions
    const incs: [number, number][] = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
    ];

    let localCount = 0;

    // For each search directions
    for (const [incI, incJ] of incs) {
        let letterCount = 0;

        // Search in said direction
        let I = startI;
        let J = startJ;

        do {
            letterCount++;
            I += incI;
            J += incJ;
        } while (
            I >= 0 && I < charMap.length &&
            J >= 0 && J < charMap[0].length &&
            letterCount < XMAS.length &&
            charMap[I][J] === XMAS.at(letterCount)
        );

        if (letterCount === XMAS.length) localCount++;
    }

    return localCount;
};

// First try: Wrong search function, looking for both X and + "crosses"
const localX_MASSearch = (
    charMap: CharMap,
    startI: number,
    startJ: number,
): number => {
    // Limit of the map, nothing to find
    if (
        startI === 0 || startI === charMap.length - 1 || startJ === 0 ||
        startJ === charMap[0].length - 1
    ) {
        return 0;
    }

    let localCount = 0;

    const pairs = [];

    // + cross
    const vertical = charMap[startI - 1][startJ] + charMap[startI][startJ] +
        charMap[startI + 1][startJ];
    const horizontal = charMap[startI][startJ - 1] + charMap[startI][startJ] +
        charMap[startI][startJ + 1];
    pairs.push([vertical, horizontal]);
    // x cross
    const diag1 = charMap[startI - 1][startJ - 1] + charMap[startI][startJ] +
        charMap[startI + 1][startJ + 1];
    const diag2 = charMap[startI + 1][startJ - 1] + charMap[startI][startJ] +
        charMap[startI - 1][startJ + 1];
    pairs.push([diag1, diag2]);

    for (const pair of pairs) {
        if (pair.every((candidate) => ["MAS", "SAM"].includes(candidate))) {
            localCount++;
        }
    }

    return localCount;
};

// Refactor first try to only include X search
const localX_MASSearch2 = (
    charMap: CharMap,
    startI: number,
    startJ: number,
): number => {
    // Limit of the map, nothing to find
    if (
        startI === 0 || startI === charMap.length - 1 || startJ === 0 ||
        startJ === charMap[0].length - 1
    ) {
        return 0;
    }

    const diag1 = charMap[startI - 1][startJ - 1] + charMap[startI][startJ] +
        charMap[startI + 1][startJ + 1];
    const diag2 = charMap[startI + 1][startJ - 1] + charMap[startI][startJ] +
        charMap[startI - 1][startJ + 1];

    return +[diag1, diag2].every((diag) => ["MAS", "SAM"].includes(diag));
};

const search = (
    charMap: string[][],
    searchedChar: string,
    localSearch: (map: string[][], i: number, j: number) => number,
): number => {
    let count = 0;

    for (let I = 0; I < charMap.length; I++) {
        for (let J = 0; J < charMap[0].length; J++) {
            if (charMap[I][J] === searchedChar) {
                count += localSearch(charMap, I, J);
            }
        }
    }

    return count;
};

// -------------
// Solve problem
// -------------

export const problem1: Solver = () => search(inputMap, "X", localXMASSearch);

const problem2: Solver = () => search(inputMap, "A", localX_MASSearch2);

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 2575 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 2065 => Too high :(
// # Misunderstood instructions
// # I was looking for both X and + "crosses", but only X crosses were searched
// # Both give the same result with given example, but not with input
// - 2041 => Correct !
