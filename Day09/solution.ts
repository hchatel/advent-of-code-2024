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
const input: string = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n")[0];

// -------------------
// Your functions here
// -------------------

const parseInput = (line: string): string[] => {
    const spaces: string[] = [];

    for (const [index, char] of line.split("").entries()) {
        spaces.push(...Array.from(
            { length: +char },
            () => index % 2 ? "." : String(index / 2),
        ));
    }

    return spaces;
};

const rearangeSpaces = (spaces: string[]): string[] => {
    let j = spaces.length - 1;

    for (let i = 0; i < j; i++) {
        if (spaces[i] === ".") {
            while (j > i && spaces[j] === ".") j--;
            if (i !== j) {
                spaces[i] = spaces[j];
                spaces[j] = ".";
                j--;
            }
        }
    }

    return spaces;
};

const computeChecksum = (spaces: string[]) => {
    let i = 0;
    let sum = 0;
    while (i < spaces.length && spaces[i] !== ".") {
        sum += i * +spaces[i];
        i++;
    }

    return sum;
};

const parseInput2 = (line: string): [string, number][] => {
    const spaces: [string, number][] = [];

    for (const [index, char] of line.split("").entries()) {
        spaces.push([index % 2 ? "." : String(index / 2), +char]);
    }

    return spaces;
};

const rearangeSpaces2 = (spaces: [string, number][]): [string, number][] => {
    let i = 0;

    // Try to fit each "file block" earlier in array
    for (let j = spaces.length - 1; j > i; j -= 1) {
        if (spaces[j][0] !== ".") {
            while (
                i < j && (spaces[i][0] !== "." || spaces[j][1] > spaces[i][1])
            ) {
                i += 1;
            }
            if (i < j) {
                // Swap spaces
                const spaceToMove: [string, number] = [...spaces[j]];
                spaces.splice(j, 1, [".", spaceToMove[1]]);
                const remainingSpace = spaces[i][1] - spaceToMove[1];
                const newSpaces: [string, number][] = remainingSpace > 0
                    ? [
                        spaceToMove,
                        [".", remainingSpace],
                    ]
                    : [spaceToMove];
                spaces.splice(i, 1, ...newSpaces);
            }
        }
        i = 1;
    }

    return spaces.filter((space) => space[1] !== 0);
};

const computeChecksum2 = (spaces: [string, number][]) => {
    let i = 0;
    let sum = 0;
    for (const space of spaces) {
        if (space[0] === ".") {
            i += space[1];
        } else {
            for (let j = 0; j < space[1]; j++) {
                sum += i * +space[0];
                i++;
            }
        }
    }

    return sum;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    const parsed = parseInput(input);
    const rearanged = rearangeSpaces(parsed);

    return computeChecksum(rearanged);
};

const problem2: Solver = () => {
    const parsed = parseInput2(input);

    const rearanged = rearangeSpaces2(parsed);
    // console.log(
    //     rearanged.map(([char, num]) =>
    //         Array.from({ length: num }, () => char).join("")
    //     ).join(""),
    // );

    return computeChecksum2(rearanged);
};

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 91486187825 // Too low :(
// => I was considering a string instead of an array, so ids above 2 digits were messing things up
// => (also example was ok, as the ids are limited to 9, *facepalm*)
// - 6446899523367 // Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 6478232739671 // Correct !
