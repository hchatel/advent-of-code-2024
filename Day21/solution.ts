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
const codes: string[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean);

// -------------------
// Your functions here
// -------------------

type Coordinates = [number, number];

type Keyboard = Record<string, Coordinates>;

const NK: Keyboard = {
    "7": [0, 0],
    "8": [0, 1],
    "9": [0, 2],
    "4": [1, 0],
    "5": [1, 1],
    "6": [1, 2],
    "1": [2, 0],
    "2": [2, 1],
    "3": [2, 2],
    "": [3, 0],
    "0": [3, 1],
    "A": [3, 2],
};

const DK: Keyboard = {
    "": [0, 0],
    "^": [0, 1],
    "A": [0, 2],
    "<": [1, 0],
    "v": [1, 1],
    ">": [1, 2],
};

const sequencesDict = new Map<string, string[][]>();
const patternScore = new Map<string, number>();

const getSequences = (btnA: string, btnB: string, keyboard: Keyboard): string[][] => {
    const sequences = sequencesDict.get(`${btnA}${btnB}`);
    if (sequences) {
        return sequences;
    }

    const btnAcoords = keyboard[btnA];
    const btnBcoords = keyboard[btnB];
    const emptySpot = keyboard[""];

    const di = btnBcoords[0] - btnAcoords[0];
    const dj = btnBcoords[1] - btnAcoords[1];
    const vertical = Array.from({ length: Math.abs(di) }, () => di > 0 ? "v" : "^");
    const horizontal = Array.from({ length: Math.abs(dj) }, () => dj > 0 ? ">" : "<");

    const HVPath = [...horizontal, ...vertical, "A"];
    const VHPath = [...vertical, ...horizontal, "A"];

    const newSequences: string[][] = [];
    // Avoid empty space
    if (btnAcoords[1] === emptySpot[1] && btnBcoords[0] === emptySpot[0]) {
        newSequences.push(HVPath);
    } else if (btnBcoords[1] === emptySpot[1] && btnAcoords[0] === emptySpot[0]) {
        newSequences.push(VHPath);
    } // Same line or column, only one path (HVPath and VHPath are the same)
    else if (di === 0 || dj === 0) {
        newSequences.push(HVPath);
    } else {
        newSequences.push(HVPath);
        newSequences.push(VHPath);
    }

    sequencesDict.set(`${btnA}${btnB}`, newSequences);

    return newSequences;
};

const getKeyboardSequences = (code: string[], numeric = false): string[][] => {
    let sequences: string[][] = [[]];
    const keyboard = numeric ? NK : DK;
    let currentButton = "A";

    for (let i = 0; i < code.length; i++) {
        const nextButton = code[i];
        const newSequences = getSequences(currentButton, nextButton, keyboard);
        sequences = sequences.flatMap((sequence) => newSequences.map((newSequence) => [...sequence, ...newSequence]));
        currentButton = nextButton;
    }

    // const minLength = sequences.reduce((min, sequence) => Math.min(min, sequence.length), sequences[0].length);

    // console.log({ sequences: sequences.map((sequence) => sequence.join("")) });

    return sequences;
};

// -------------
// Solve problem
// -------------

// V1
// const problem1: Solver = () => {
//     let complexity = 0;

//     for (const code of codes) {
//         let sequences = getNumericKeyboardSequences(code);
//         sequences = sequences.flatMap((sequence) => getDirectionalKeyboardSequences(sequence));
//         sequences = sequences.flatMap((sequence) => getDirectionalKeyboardSequences(sequence));

//         const minLength = sequences.reduce((min, sequence) => Math.min(min, sequence.length), sequences[0].length);

//         complexity += minLength * +code.substring(0, 3);
//     }

//     return complexity;
// };

// V2

const problem1: Solver = () => {
    let complexity = 0;

    for (const code of codes) {
        let sequences = getKeyboardSequences(code.split(""), true);
        sequences = sequences.flatMap((sequence) => getKeyboardSequences(sequence));
        sequences = sequences.flatMap((sequence) => getKeyboardSequences(sequence));

        const minLength = sequences.reduce((min, sequence) => Math.min(min, sequence.length), sequences[0].length);

        complexity += minLength * +code.substring(0, 3);
    }

    return complexity;
};

const problem2: Solver = () => {
    let complexity = 0;

    for (const code of codes) {
        console.log(code);
        let sequences = getKeyboardSequences(code.split(""), true);

        // let sequencesCount = sequences.length;
        // let sequencesLength = sequences[0].length;

        for (let i = 0; i < 2; i++) {
            console.log("   => ", i + 1);
            sequences = sequences.flatMap((sequence) => getKeyboardSequences(sequence));
            // console.log(
            //     "   => Growth:",
            //     sequencesLength,
            //     "*",
            //     sequencesCount,
            //     "to",
            //     sequences.length,
            //     "*",
            //     sequences[0].length,
            //     " => ",
            //     sequences.length * sequences[0].length / (sequencesCount * sequencesLength),
            // );
            // sequencesLength = sequences[0].length;
            // sequencesCount = sequences.length;
        }

        const [minLength, maxLength] = sequences.reduce(
            ([min, max], sequence) => [Math.min(min, sequence.length), Math.max(max, sequence.length)],
            [sequences[0].length, sequences[0].length],
        );

        // console.log({
        //     code,
        //     minLength,
        //     maxLength,
        //     value: +code.substring(0, 3),
        //     complexity: minLength * +code.substring(0, 3),
        // });

        complexity += minLength * +code.substring(0, 3);
    }

    return complexity;
};

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 176650 => Correct !

// solveWithLogs(problem2, 2);
// Tries:
// -
