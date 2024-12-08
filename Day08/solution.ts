import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type InputLine = string;

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const inputLines: InputLine[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean);

// -------------------
// Your functions here
// -------------------

const countAntinodes = (lines: string[], countEveryAntinodes = false) => {
    const I = lines.length;
    const J = lines[0].length;

    const antennas = new Map<string, [number, number][]>();

    // Find antennas
    for (let i = 0; i < I; i++) {
        for (let j = 0; j < J; j++) {
            const char = lines[i][j];
            if (char !== ".") {
                const previousAntennas = antennas.get(char);
                if (previousAntennas) {
                    antennas.set(char, [...previousAntennas, [i, j]]);
                } else {
                    antennas.set(char, [[i, j]]);
                }
            }
        }
    }

    // Count nodes
    const antinodes = new Set<string>();

    for (const [_antenna, positions] of antennas.entries()) {
        // Loop through each antennas pairs to find if antinodes are on the map
        for (const [index, position] of positions.entries()) {
            for (let i = index + 1; i < positions.length; i++) {
                const dI = positions[i][0] - position[0];
                const dJ = positions[i][1] - position[1];

                if (countEveryAntinodes) {
                    // Part 2
                    const k = Math.floor(position[0] / dI);
                    for (
                        let l = position[0] - k * dI, c = position[1] - k * dJ;
                        l < I;
                        l += dI, c += dJ
                    ) {
                        if (c >= 0 && c < J) {
                            antinodes.add(JSON.stringify([l, c]));
                        }
                    }
                } else {
                    // Part 1
                    if (
                        position[0] - dI >= 0 && position[1] - dJ >= 0 &&
                        position[1] - dJ < J
                    ) {
                        antinodes.add(
                            JSON.stringify([
                                position[0] - dI,
                                position[1] - dJ,
                            ]),
                        );
                    }

                    if (
                        positions[i][0] + dI < I && positions[i][1] + dJ >= 0 &&
                        positions[i][1] + dJ < J
                    ) {
                        antinodes.add(
                            JSON.stringify([
                                positions[i][0] + dI,
                                positions[i][1] + dJ,
                            ]),
                        );
                    }
                }
            }
        }
    }

    return antinodes.size;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => countAntinodes(inputLines);

const problem2: Solver = () => countAntinodes(inputLines, true);

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 261

solveWithLogs(problem2, 2);
// Tries:
// - 898
