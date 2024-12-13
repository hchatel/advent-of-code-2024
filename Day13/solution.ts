import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

interface Claw {
    A: [number, number];
    B: [number, number];
    prize: [number, number];
}
// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";

const parseGroup = (group: string): Claw => {
    const buttonRegex = /Button .: X\+(\d+), Y\+(\d+)/;
    const lines = group.split("\n");

    const matchA = lines[0].match(buttonRegex);
    const matchB = lines[1].match(buttonRegex);
    const matchC = lines[2].match(/Prize: X=(\d+), Y=(\d+)/);

    return {
        A: matchA ? [+matchA[1], +matchA[2]] : [0, 0],
        B: matchB ? [+matchB[1], +matchB[2]] : [0, 0],
        prize: matchC ? [+matchC[1], +matchC[2]] : [0, 0],
    };
};

const inputClaws: Claw[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n\n").filter(Boolean).map(parseGroup);

// -------------------
// Your functions here
// -------------------

// First approach ("brute force")

const countTokens = (claw: Claw): number => {
    for (let i = 100; i >= 0; i--) {
        const ax = (claw.prize[0] - i * claw.B[0]) / claw.A[0];
        const ay = (claw.prize[1] - i * claw.B[1]) / claw.A[1];
        if (ax === ay) {
            if (ax > 100) {
                throw new Error("Too high");
            }
            console.log(ax, i);
            return i + 3 * ax;
        }
    }

    return 0;
};

// Second approach: Let's do some Math <3

const countBigTokens = (claw: Claw, prizeOffset = 0): number => {
    const [aX, aY] = claw.A;
    const [bX, bY] = claw.B;
    let [pX, pY] = claw.prize;
    if (prizeOffset) {
        pX += prizeOffset;
        pY += prizeOffset;
    }

    const b = (aX * pY - aY * pX) / (bY * aX - bX * aY);

    if (Number.isInteger(b)) {
        const a = (pX - b * bX) / aX;

        if (Number.isInteger(a)) {
            return b + 3 * a;
        }
    }

    return 0;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => inputClaws.reduce((sum, claw) => sum + countBigTokens(claw), 0);

const problem2: Solver = () => inputClaws.reduce((sum, claw) => sum + countBigTokens(claw, 10000000000000), 0);

// };

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 25629 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 107487112929999 => Correct !
