import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

// Line / Column coordinates
type Coordinates = [number, number];

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const inputCoords: Coordinates[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean).map((line): Coordinates => {
    const parts = line.split(",");

    return [+parts[1], +parts[0]];
});

const DIRECTIONS: Coordinates[] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

// -------------------
// Your functions here
// -------------------

const MAP_SIZE = USE_TEST_INPUT ? 7 : 71;

interface Path {
    position: Coordinates;
    length: number;
}

const solveMaze = (corruptedCoords: Coordinates[], bytesToRead: number) => {
    const start: Coordinates = [0, 0];
    const end: Coordinates = [MAP_SIZE - 1, MAP_SIZE - 1];

    const scoreMap = new Map<string, number>();
    scoreMap.set(JSON.stringify(start), 1);

    for (let i = 0; i < corruptedCoords.length && i < bytesToRead; i++) {
        scoreMap.set(JSON.stringify(corruptedCoords[i]), -1);
    }

    const paths: Path[] = [];
    let path: Path | undefined = { position: start, length: 1 };

    while (path) {
        for (const [dx, dy] of DIRECTIONS) {
            const x = path.position[0] + dx;
            const y = path.position[1] + dy;
            if (x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
                const newPath: Path = { position: [x, y], length: path.length + 1 };
                const positionKey = JSON.stringify(newPath.position);
                const currentScore = scoreMap.get(positionKey);

                if (!currentScore || (currentScore != -1 && currentScore > newPath.length)) {
                    scoreMap.set(positionKey, newPath.length);
                    if (positionKey !== JSON.stringify(end)) {
                        paths.push(newPath);
                    }
                }
            }
        }

        path = paths.pop();
    }

    return scoreMap.get(JSON.stringify(end)) ?? 0;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => solveMaze(inputCoords, USE_TEST_INPUT ? 12 : 1024) - 1;

// First approach: Search from the end (as the computation is faster to fail)
// const problem2: Solver = () => {
//     for (let i = inputCoords.length - 1; i >= 0; i--) {
//         if (solveMaze(inputCoords, i)) {
//             console.log("Found at byte", i);
//             return `${inputCoords[i][1]},${inputCoords[i][0]}`;
//         }
//     }

//     return "";
// };
// => Outputs the result in ~300ms

// Let's try to improve search speed

// Second approach: Dichotomy search
// const problem2: Solver = () => {
//     let lowerBound = 0;
//     let upperBound = inputCoords.length - 1;
//     let midPoint = Math.floor((upperBound + lowerBound) / 2);

//     while (midPoint !== lowerBound) {
//         if (solveMaze(inputCoords, midPoint)) {
//             lowerBound = midPoint;
//         } else {
//             upperBound = midPoint;
//         }
//         midPoint = Math.floor((upperBound + lowerBound) / 2);
//     }

//     console.log("Found at byte", midPoint);
//     return `${inputCoords[midPoint][1]},${inputCoords[midPoint][0]}`;
// };
// => Outputs the result in ~700ms

// Third approach: Dichotomy search, but favored toward the end (as it is faster to fail)
const problem2: Solver = () => {
    let lowerBound = 0;
    let upperBound = inputCoords.length - 1;
    let barycentre = Math.ceil((3 * upperBound + lowerBound) / 4);

    while (barycentre !== upperBound) {
        if (solveMaze(inputCoords, barycentre)) {
            lowerBound = barycentre;
        } else {
            upperBound = barycentre;
        }
        barycentre = Math.ceil((3 * upperBound + lowerBound) / 4);
    }

    // Last adjustment
    while (!solveMaze(inputCoords, --barycentre)) {}

    console.log("Found at byte", barycentre);
    return `${inputCoords[barycentre][1]},${inputCoords[barycentre][0]}`;
};
// => Outputs the result in ~700ms

// ---------------
// Display answers
// ---------------

// solveWithLogs(problem1, 1);
// Tries:
// - 330 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 10,38 => Correct !
