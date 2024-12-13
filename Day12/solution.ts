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

// Approach 1
// Visit every plant
// - Add 1 to corresponding plant
// - Add 0-4 depending on neighbors
// => WRONG ! If a same plant is on two regions, then totalArea * totalPerimeter !== SUM(area * perimeter)

interface Region {
    area: number;
    perimeter: number;
}

// const computeCost = (lines: InputLine[]): number => {
//     const regions = new Map<string, Region>();

//     for (let i = 0; i < lines.length; i++) {
//         for (let j = 0; j < lines[0].length; j++) {
//             const plant = lines[i][j];
//             const region: Region = regions.get(plant) ?? { area: 0, perimeter: 0 };
//             region.area++;
//             for (const [dI, dJ] of [[1, 0], [0, -1], [-1, 0], [0, 1]]) {
//                 const I = i + dI;
//                 const J = j + dJ;
//                 if (I < 0 || I >= lines.length || J < 0 || J >= lines[0].length || lines[I][J] !== plant) {
//                     region.perimeter++;
//                 }
//             }
//             regions.set(plant, region);
//         }
//     }

//     console.log(regions);

//     return regions.values().reduce((sum, { area, perimeter }) => sum + area * perimeter, 0);
// };

// Approach 2
// Visit each plant
// - Find every plant in that region (and remember visited locations)
// - Count neighbors => Number of fences

const computeCost = (lines: InputLine[]): [number, number] => {
    const visited = new Set<string>();

    let cost = 0;
    let costDiscount = 0;

    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (!visited.has(String([i, j]))) {
                visited.add(String([i, j]));
                const plant = lines[i][j];
                const plantsInRegion = new Set();
                const plantsLocations: [number, number][] = [[i, j]];
                const fencesSet = new Set<string>(); // Stores coordinates and orientation (1 if vertical, 0 if horizontal)

                while (plantsLocations.length) {
                    const location = plantsLocations.pop()!;
                    if (!plantsInRegion.has(String(location))) {
                        plantsInRegion.add(String(location));
                        // Check neighbors

                        for (const [dI, dJ] of [[1, 0], [0, -1], [-1, 0], [0, 1]]) {
                            const I = location[0] + dI;
                            const J = location[1] + dJ;
                            if (I >= 0 && I < lines.length && J >= 0 && J < lines[0].length && lines[I][J] === plant) {
                                plantsLocations.push([I, J]);
                                visited.add(String(location));
                            } else {
                                fencesSet.add(
                                    JSON.stringify([location[0] + +(dI === 1), location[1] + +(dJ === 1), +(dI === 0)]),
                                );
                            }
                        }
                    }
                }

                // Count aligned fences

                const fences = [...fencesSet.values()].map((value) => JSON.parse(value)) as unknown as [
                    number,
                    number,
                    number,
                ][];

                let alignedFences = 0;
                for (let f1 = 0; f1 < fences.length; f1++) {
                    for (let f2 = f1 + 1; f2 < fences.length; f2++) {
                        // Fences must be:
                        // - Aligned
                        // - Next to each other regarding fence direction
                        // - Unless fences arranged in a "+ shape" like in inputTest2 (fences are "aligned" but from separate edges)
                        if (
                            fences[f1][2] === fences[f2][2] &&
                            Math.abs(fences[f1][0] - fences[f2][0]) === fences[f1][2] &&
                            Math.abs(fences[f1][1] - fences[f2][1]) === 1 - fences[f1][2] &&
                            !fencesSet.has(
                                JSON.stringify([
                                    Math.max(fences[f1][0], fences[f2][0]),
                                    Math.max(fences[f1][1], fences[f2][1]),
                                    1 - fences[f1][2],
                                ]),
                            )
                        ) {
                            alignedFences++;
                        }
                    }
                }

                const edges = fences.length - alignedFences;

                cost += plantsInRegion.size * fences.length;
                costDiscount += plantsInRegion.size * edges;
            }
        }
    }

    return [cost, costDiscount];
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => computeCost(inputLines)[0];

const problem2: Solver = () => computeCost(inputLines)[1];

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 1522850 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 965286 => Too high (expected)
// - 942774 => Too low
// => Did not account for "+ shaped" group of 4 fences we encounter in a shape like
// AAA
// A A
// AA
// - 953738 => Correct !
