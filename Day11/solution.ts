import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type InputStones = number[];

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const inputStones: InputStones = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n")[0].split(" ").map(Number);

// -------------------
// Your functions here
// -------------------

// Approach 1: Naïve / Brute force
// => Instantaneous until ~30 steps, then very slow... Then it crashes at step 39 !

const stoneEvolutionMap = new Map<number, number[]>();

const evolveStone = (stone: number): number[] => {
    if (stone === 0) {
        return [1];
    }
    const str = String(stone);
    const digits = str.length;
    if (digits % 2 === 0) {
        const halfIndex = digits / 2;
        return [+str.substring(0, halfIndex), +str.substring(halfIndex)];
    }

    return [stone * 2024];
};

const evolveStonesRow = (stones: number[]): number[] => {
    return stones.flatMap((stone) => evolveStone(stone));
};

// Approach 2: Use a map to group similar stones
// => 75 steps in around 65ms
type StonesMap = Map<number, number>;

const evolveStonesMap = (stonesMap: StonesMap): StonesMap => {
    const nextStonesMap: StonesMap = new Map();
    for (const [stone, count] of stonesMap.entries()) {
        // Approach 3:
        // const evolutions = evolveStone(stone);
        const evolutions = getEvolution(stone);

        for (const evolution of evolutions) {
            nextStonesMap.set(
                evolution,
                (nextStonesMap.get(evolution) ?? 0) + count,
            );
        }
    }

    return nextStonesMap;
};

// Approach 3: Try to remember evolutions of specific stone
// => Down to around 50ms
const getEvolution = (stone: number): number[] => {
    let evolution = stoneEvolutionMap.get(stone);
    if (evolution) {
        return evolution;
    }

    evolution = evolveStone(stone);
    stoneEvolutionMap.set(stone, evolution);

    return evolution;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    let stones = inputStones;
    const steps = 25;
    for (let i = 0; i < steps; i++) {
        stones = evolveStonesRow(stones);
    }

    return stones.length;
};

const problem2: Solver = () => {
    let stonesMap: StonesMap = new Map();

    // Init map
    for (const stone of inputStones) {
        stonesMap.set(stone, (stonesMap.get(stone) ?? 0) + 1);
    }

    // Run evolutions
    const steps = 75;
    for (let i = 0; i < steps; i++) {
        stonesMap = evolveStonesMap(stonesMap);
    }

    return stonesMap.values().reduce((sum, value) => sum + value, 0);
};

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 55312 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 65601038650482 => Too low :(  => Was running on test input *facepalm*
// - 266820198587914 => Correct
