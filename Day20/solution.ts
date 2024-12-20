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
const inputLines: string[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean);

// -------------------
// Your functions here
// -------------------

const DIRECTIONS: Coordinates[] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

type ScoreMap = number[][];
type Coordinates = [number, number];

const getStartPosition = (lines: string[]): Coordinates => {
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (lines[i].charAt(j) === "S") {
                return [i, j];
            }
        }
    }

    return [-1, -1];
};

const fillScoreMap = (lines: string[]): ScoreMap => {
    const scoreMap: ScoreMap = Array.from(
        { length: lines.length },
        () => Array.from({ length: lines[0].length }, () => -1),
    );

    const cells: Coordinates[] = [];
    const startPosition = getStartPosition(lines);
    let cell: Coordinates | undefined = startPosition;
    scoreMap[startPosition[0]][startPosition[1]] = 0;

    while (cell) {
        for (const [di, dj] of DIRECTIONS) {
            const i = cell[0] + di;
            const j = cell[1] + dj;
            const neighborScore = scoreMap[cell[0]][cell[1]] + 1;

            if (lines[i].charAt(j) !== "#" && (scoreMap[i][j] < 0 || neighborScore < scoreMap[i][j])) {
                scoreMap[i][j] = neighborScore;
                if (lines[i].charAt(j) !== "E") {
                    cells.push([i, j]);
                }
            }
        }

        cell = cells.pop();
    }

    return scoreMap;
};

const countCheats = (scoreMap: ScoreMap, diff: number) => {
    let cheats = 0;
    const distance = 2;

    // Loop over scoreMap
    for (let I = 0; I < scoreMap.length; I++) {
        for (let J = 0; J < scoreMap[0].length; J++) {
            // For each score, search for a neighbor with:
            // - A distance of at most "distance"
            // - A score at least "diff" larger
            if (scoreMap[I][J] !== -1) {
                for (const [di, dj] of DIRECTIONS) {
                    for (let d = 1; d <= distance; d++) {
                        const i = I + d * di;
                        const j = J + d * dj;
                        if (i >= 0 && i < scoreMap.length && j >= 0 && j < scoreMap[0].length) {
                            if (scoreMap[i][j] >= 0 && scoreMap[i][j] > scoreMap[I][J] + diff) {
                                // console.log([i, j]);
                                cheats++;
                            }
                        }
                    }
                }
            }
        }
    }

    return cheats;
};

// For logging purpose, to display answer like in riddle
// const bestCheats: Record<number, number> = {};

const countMoreCheats = (scoreMap: ScoreMap, diff: number) => {
    let cheats = 0;
    const maxLength = 20;

    // Loop over scoreMap
    for (let I = 1; I < scoreMap.length - 1; I++) {
        for (let J = 1; J < scoreMap[0].length - 1; J++) {
            if (scoreMap[I][J] !== -1) {
                for (let i = I - maxLength; i <= I + maxLength; i++) {
                    for (let j = J - maxLength; j <= J + maxLength; j++) {
                        if (
                            i > 0 && i < scoreMap.length - 1 &&
                            j > 0 && j < scoreMap[0].length - 1
                        ) {
                            const cheatLength = Math.abs(i - I) + Math.abs(j - J);
                            const saved = scoreMap[i][j] - scoreMap[I][J] - cheatLength;
                            if (
                                cheatLength <= maxLength &&
                                scoreMap[i][j] > 0 &&
                                saved >= diff
                            ) {
                                cheats++;
                                // bestCheats[saved] = (bestCheats[saved] ?? 0) + 1;
                            }
                        }
                    }
                }
            }
        }
    }

    // console.log(bestCheats);

    return cheats;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    const scoreMap = fillScoreMap(inputLines);

    return countCheats(scoreMap, USE_TEST_INPUT ? 20 : 100);
};

// Expect 285 with test Input
const problem2: Solver = () => {
    const scoreMap = fillScoreMap(inputLines);

    return countMoreCheats(scoreMap, USE_TEST_INPUT ? 50 : 100);
};

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 1402 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 1020244 => Correct !
