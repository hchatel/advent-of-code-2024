import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type Warehouse = string[][];
type Coordinates = [number, number];

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const [mapString, instructions] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n\n");

const warehouse: Warehouse = mapString.split("\n").map((line) => line.split(""));

const DIRS: Record<">" | "<" | "^" | "v", [number, number]> = {
    ">": [0, 1],
    "<": [0, -1],
    "^": [-1, 0],
    "v": [1, 0],
};

// -------------------
// Your functions here
// -------------------

const getStartingPoint = (warehouse: Warehouse): Coordinates => {
    for (let i = 0; i < warehouse.length; i++) {
        for (let j = 0; j < warehouse[0].length; j++) {
            if (warehouse[i][j] === "@") {
                return [i, j];
            }
        }
    }

    return [0, 0];
};

// Try and move block and adjacent blocks
// Returns null  if stuck, new position otherwise
const moveByOne = (warehouse: Warehouse, position: Coordinates, direction: Coordinates): Coordinates | null => {
    const nextI = position[0] + direction[0];
    const nextJ = position[1] + direction[1];
    if (warehouse[nextI][nextJ] === "#") {
        return null;
    }
    if (warehouse[nextI][nextJ] === "." || moveByOne(warehouse, [nextI, nextJ], direction)) {
        warehouse[nextI][nextJ] = warehouse[position[0]][position[1]];
        warehouse[position[0]][position[1]] = ".";
        return [nextI, nextJ];
    }

    return null;
};

const computeScore = (warehouse: Warehouse): number => {
    let sum = 0;

    for (let i = 0; i < warehouse.length; i++) {
        for (let j = 0; j < warehouse[0].length; j++) {
            if (warehouse[i][j] === "O" || warehouse[i][j] === "[") {
                sum += i * 100 + j;
            }
        }
    }

    return sum;
};

const displayWarehouse = (warehouse: Warehouse) => console.log(warehouse.map((line) => line.join("")).join("\n"));

const widenWarehouse = (warehouse: Warehouse): Warehouse =>
    warehouse.map((line) =>
        line.flatMap((char) => {
            if (char === ".") return [".", "."];
            if (char === "@") return ["@", "."];
            if (char === "#") return ["#", "#"];

            return ["[", "]"];
        })
    );

// Check if some blocks can move in specific direction
// If they encounters other blocks, check if they can move as well
//  => Return null if at least one block is blocked
//  => Otherwise, return every blocks positions along with blocks that are pushed
const checkMove = (
    warehouse: Warehouse,
    positions: Coordinates[],
    direction: Coordinates,
): null | Coordinates[] => {
    const newPositions = positions.flatMap((position) => {
        const nextI = position[0] + direction[0];
        const nextJ = position[1] + direction[1];

        if (warehouse[nextI][nextJ] === ".") {
            return [];
        }
        if (warehouse[nextI][nextJ] === "]") {
            return direction[0]
                ? checkMove(warehouse, [[nextI, nextJ - 1], [nextI, nextJ]], direction)
                : checkMove(warehouse, [[nextI, nextJ]], direction);
        }
        if (warehouse[nextI][nextJ] === "[") {
            return direction[0]
                ? checkMove(warehouse, [[nextI, nextJ], [nextI, nextJ + 1]], direction)
                : checkMove(warehouse, [[nextI, nextJ]], direction);
        }

        return null;
    });

    // If some block is against wall, then nothing moves
    if (newPositions.some((position) => position === null)) return null;

    const deduplicated: Coordinates[] = [];
    for (const position of newPositions as Coordinates[]) {
        if (!deduplicated.some(([i, j]) => i === position[0] && j === position[1])) {
            deduplicated.push(position);
        }
    }

    return [...positions, ...deduplicated];
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    let robotPosition = getStartingPoint(warehouse);

    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i] as ">" | "<" | "^" | "v";
        if (DIRS[instruction]) {
            const newPosition = moveByOne(warehouse, robotPosition, DIRS[instruction]);
            if (newPosition) {
                robotPosition = newPosition;
            }
        }
    }

    // displayWarehouse(warehouse);

    return computeScore(warehouse);
};

const problem2: Solver = () => {
    // Widen warehouse
    const wideWarehouse = widenWarehouse(warehouse);
    const robotPosition = getStartingPoint(wideWarehouse);

    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i] as ">" | "<" | "^" | "v";
        const direction = DIRS[instruction];
        if (direction) {
            // Get the position of every moving blocks
            const blocksToMove = checkMove(wideWarehouse, [robotPosition], direction);

            if (blocksToMove) {
                // Sort along direction
                blocksToMove.sort((pos1, pos2) => {
                    if (direction[0]) {
                        return direction[0] * (pos1[0] - pos2[0]) < 0 ? -1 : 1;
                    }
                    return direction[1] * (pos1[1] - pos2[1]) < 0 ? -1 : 1;
                });

                // Move them along direction
                for (let m = blocksToMove.length - 1; m >= 0; m--) {
                    const [i, j] = blocksToMove[m];
                    const nextI = i + direction[0];
                    const nextJ = j + direction[1];

                    wideWarehouse[nextI][nextJ] = wideWarehouse[i][j];
                    wideWarehouse[i][j] = ".";
                }
                robotPosition[0] += direction[0];
                robotPosition[1] += direction[1];
            }
        }
    }

    displayWarehouse(wideWarehouse);

    return computeScore(wideWarehouse);
};

// ---------------
// Display answers
// ---------------

// solveWithLogs(problem1, 1);
// Tries:
// - 1526673 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 1551438 => Too high :(
// =>   To deduplicate positions in checkMove,
//      I was turning them into a Set, then
//      back to an array which seemed to scrumble
//      positions ordering (which is needed for
//      later move operation)
// - 1539884 => Too high :(
// =>   Changing deduplicating method did not change ordering problems.
//      Sort moves along direction before moving anything
// - 1535509 => Correct !
