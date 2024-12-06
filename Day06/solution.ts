import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type ObstaclesMap = string[][];
type Position = [number, number];

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const obstaclesMap: ObstaclesMap = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean).map((line) => line.split(""));

// -------------------
// Your functions here
// -------------------
const DIRECTIONS_STEPS = [
    [-1, 0], // UP
    [0, 1], // RIGHT
    [1, 0], // DOWN
    [0, -1], // LEFT
];

type VisitedPlacesMap = Map<string, number[]>;

// First version

// const getVisitedPlaces = (map: ObstaclesMap): VisitedPlacesMap | null => {
//     const visitedPlaces: VisitedPlacesMap = new Map();

//     let I = 0, J = 0;

//     // Find starting point
//     for (const [i, line] of map.entries()) {
//         const j = line.findIndex((pos) => pos === "^");
//         if (j !== -1) {
//             I = i;
//             J = j;
//             break;
//         }
//     }

//     // Walk through
//     let directionIndex = 0;
//     let direction = DIRECTIONS_STEPS[directionIndex];
//     do {
//         // Record position
//         const previouslyVisited = visitedPlaces.get(`${I}|${J}`);
//         if (previouslyVisited) {
//             if (previouslyVisited.some((idx) => idx === directionIndex)) {
//                 // Loop
//                 return null;
//             } else {
//                 visitedPlaces.set(`${I}|${J}`, [
//                     ...previouslyVisited,
//                     directionIndex,
//                 ]);
//             }
//         } else {
//             visitedPlaces.set(`${I}|${J}`, [
//                 directionIndex,
//             ]);
//         }

//         // Check where to move
//         if (map[I + direction[0]]?.[J + direction[1]] === "#") {
//             directionIndex = (directionIndex + 1) % 4;
//             direction = DIRECTIONS_STEPS[directionIndex];
//         } else {
//             I += direction[0];
//             J += direction[1];
//         }
//     } while (I >= 0 && I < map.length && J >= 0 && J <= map[0].length);

//     return visitedPlaces;
// };

// const walkingSimulator = (map: ObstaclesMap): number =>
//     getVisitedPlaces(map)?.size ?? 0;

// const loopSimulator = (map: ObstaclesMap): number => {
//     const possibleObstacles = new Set<string>();

//     const visitedPlaces = getVisitedPlaces(map);

//     if (!visitedPlaces) return 0;

//     for (const place of visitedPlaces.keys()) {
//         const directionIndexes = visitedPlaces.get(place);

//         // Try to place an obstacle after each move
//         for (let i = 0; directionIndexes && i < directionIndexes.length; i++) {
//             const [I, J] = place.split("|").map(Number);
//             const direction = DIRECTIONS_STEPS[directionIndexes[i]];
//             const newMap = JSON.parse(JSON.stringify(map));

//             const nextI = I + direction[0];
//             const nextJ = J + direction[1];

//             if (
//                 nextI >= 0 && nextI < map.length && nextJ > 0 &&
//                 nextJ < map[0].length
//             ) {
//                 newMap[I + direction[0]][J + direction[1]] = "#";
//                 if (walkingSimulator(newMap) === 0) {
//                     possibleObstacles.add(`${nextI}|${nextJ}`);
//                 }
//             }
//         }
//     }

//     return possibleObstacles.size;
// };

// Cleaning / Refactor
// => Execution time of part 2 divided by ~2

const getStartingPosition = (map: ObstaclesMap): Position => {
    for (const [i, line] of map.entries()) {
        const j = line.findIndex((pos) => pos === "^");
        if (j !== -1) {
            return [i, j];
        }
    }

    return [-1, -1];
};

const getVisitedPlaces = (
    map: ObstaclesMap,
    startPos: Position,
    obstacle?: Position,
): VisitedPlacesMap | null => {
    const visitedPlaces: VisitedPlacesMap = new Map();

    // Walk through
    let [I, J] = startPos;
    let direction = 0;
    let [stepI, stepJ] = DIRECTIONS_STEPS[direction];
    while (true) {
        // Record current position
        const stringifiedPosition = JSON.stringify([I, J]);
        const previouslyVisited = visitedPlaces.get(stringifiedPosition);
        if (previouslyVisited) {
            if (previouslyVisited.some((idx) => idx === direction)) {
                // Loop
                return null;
            } else {
                visitedPlaces.set(stringifiedPosition, [
                    ...previouslyVisited,
                    direction,
                ]);
            }
        } else {
            visitedPlaces.set(stringifiedPosition, [
                direction,
            ]);
        }

        // Check next position
        const nextI = I + stepI;
        const nextJ = J + stepJ;
        if (
            nextI < 0 || nextI >= map.length || nextJ < 0 ||
            nextJ > map[0].length
        ) {
            // Out of the map
            break;
        }
        if (
            map[nextI][nextJ] === "#" ||
            (obstacle && nextI === obstacle[0] && nextJ === obstacle[1])
        ) {
            // Turn
            direction = (direction + 1) % 4;
            [stepI, stepJ] = DIRECTIONS_STEPS[direction];
        } else {
            // Walk a step
            I = nextI;
            J = nextJ;
        }
    }

    return visitedPlaces;
};

const countLoops = (map: ObstaclesMap): number => {
    const possibleObstacles = new Set<string>();
    const start = getStartingPosition(map);

    const visitedPlaces = getVisitedPlaces(map, start);

    if (!visitedPlaces) return 0;

    for (const place of visitedPlaces.keys()) {
        const directions = visitedPlaces.get(place);

        // Try to place an obstacle after each move
        for (let i = 0; directions && i < directions.length; i++) {
            const [I, J] = JSON.parse(place);
            const [stepI, stepJ] = DIRECTIONS_STEPS[directions[i]];

            const nextI = I + stepI;
            const nextJ = J + stepJ;

            // If next position is not outside the map or already an obstacle
            // check if placing an obstacle creates a loop, if so : save coordinates
            if (
                nextI >= 0 && nextI < map.length && nextJ > 0 &&
                nextJ < map[0].length && map[nextI][nextJ] !== "#" &&
                getVisitedPlaces(map, start, [nextI, nextJ]) === null
            ) {
                possibleObstacles.add(JSON.stringify([nextI, nextJ]));
            }
        }
    }

    return possibleObstacles.size;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    const startPosition = getStartingPosition(obstaclesMap);

    return getVisitedPlaces(obstaclesMap, startPosition)?.size ?? -1;
};

const problem2: Solver = () => countLoops(obstaclesMap);

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 4696 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 1443 => Correct !
