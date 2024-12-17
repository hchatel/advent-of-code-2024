import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type InputLine = string;

// Switch inputs here manually or using --test option in cmd line
const inputFilename = (Deno.args.some((arg) => ["-t", "--test"].includes(arg)) && "inputTest.txt") ||
    (Deno.args.some((arg) => ["-t2", "--test2"].includes(arg)) && "inputTest2.txt") ||
    "input.txt";

// Read file
const inputLines: InputLine[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean);

// -------------------
// Your functions here
// -------------------

const DIRECTIONS: Coordinates[] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

type Coordinates = [number, number];

interface Path {
    position: Coordinates;
    direction: number;
    score: number;
    steps: Coordinates[];
}

const displayScoreMap = (map: number[][], topEndPreview = 0) => {
    const topEnd = topEndPreview ? map.slice(-topEndPreview).map((line) => line.slice(0, topEndPreview)) : map;
    console.log(topEnd.map((line) => line.join("\t")).join("\n"));
};

const displayBestSits = (map: InputLine[], bestSits: Set<string>, topEndPreview = 0) => {
    const topEnd = topEndPreview ? map.slice(-topEndPreview).map((line) => line.slice(0, topEndPreview)) : map;
    console.log(
        topEnd.map((line, i) =>
            line.split("").map((char, j) => bestSits.has(JSON.stringify([i, j])) ? "O" : char).join("")
        ).join("\n"),
    );
};

const findMinScore = (inputLines: InputLine[]): [number, number] => {
    const I = inputLines.length;
    const J = inputLines[0].length;

    const pathsToExplore: Path[] = [];
    const scoreMap = Array.from({ length: I }, () => Array.from({ length: J }, () => -1));

    const startPosition: Coordinates = [I - 2, 1];
    let path: Path | undefined = { position: startPosition, direction: 1, score: 0, steps: [] };

    let iterations = 0;

    const bestSits = new Set<string>([JSON.stringify([I - 2, 1], [1, J - 2])]);

    const fullPaths: Path[] = [];

    while (path) {
        iterations++;
        const { position: [i, j], direction, score, steps } = path;
        // Check every direction (exept backward)
        for (let d = 0; d < DIRECTIONS.length; d++) {
            if (d !== (path.direction + 2) % 4) {
                const newI = i + DIRECTIONS[d][0];
                const newJ = j + DIRECTIONS[d][1];

                // If not a wall, move one step and compute score
                if (inputLines[newI].charAt(newJ) !== "#") {
                    const newScore = score + 1 + (d === direction ? 0 : 1000);

                    // If position has not been visited, or if the score is possibly lower (at a turn)
                    // => Update scoreMap and put path back into exploration pull
                    if (scoreMap[newI][newJ] === -1 || newScore - scoreMap[newI][newJ] <= 1000) {
                        // Update score only if position has not been visited or score is lower
                        if (scoreMap[newI][newJ] === -1 || newScore < scoreMap[newI][newJ]) {
                            scoreMap[newI][newJ] = newScore;
                        }
                        const newPath: Path = {
                            position: [newI, newJ],
                            direction: d,
                            score: newScore,
                            steps: [...steps, [newI, newJ]],
                        };

                        if (inputLines[newI].charAt(newJ) !== "E") {
                            pathsToExplore.push(newPath);
                        } else {
                            fullPaths.push(newPath);
                        }
                    }
                }
            }
        }

        path = pathsToExplore.pop();
    }

    for (const path of fullPaths) {
        if (path.score === scoreMap[1][J - 2]) {
            for (const sit of path.steps) {
                bestSits.add(JSON.stringify(sit));
            }
        }
    }

    // displayScoreMap(scoreMap);
    // displayBestSits(inputLines, bestSits);

    console.log(iterations, "iterations");

    return [scoreMap[1][J - 2], bestSits.size];
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => findMinScore(inputLines)[0];
const problem2: Solver = () => findMinScore(inputLines)[1];

// ---------------
// Display answers
// ---------------

// solveWithLogs(problem1, 1);
// Tries:
// - 89468 => Too high :/
//   => My condition to keep the path was:      scoreMap[newI][newJ] === -1 || newScore < scoreMap[newI][newJ]
//   => Tried to account keep paths with same
//      score but different directions =>       scoreMap[newI][newJ] === -1 || newScore <= scoreMap[newI][newJ]
//   => Of course, the condition should be
//      even larger to account for turns =>     scoreMap[newI][newJ] === -1 || newScore - scoreMap[newI][newJ] < 1000
// - 89464 => Too high :(
//   => Silly me forgot to add the strict condition to update scoreMap now that the first condition is too "wide"
// - 89460 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 504 => Correct !
// Should be optimized, it takes >2min to solve at the moment.
// The slowness comes from the storing of steps in Path object.
// Maybe a faster method would be to compute scoreMap, then do
// a second search (from Start to End or End to start) to find
// best paths along minimum scores.
