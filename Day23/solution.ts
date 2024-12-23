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

type Nodes = Record<string, string[]>;

const inputNodes: Nodes = {};

for (const line of inputLines) {
    const [node1, node2] = line.split("-");
    inputNodes[node1] = [...(inputNodes[node1] ?? []), node2];
    inputNodes[node2] = [...(inputNodes[node2] ?? []), node1];
}

// -------------------
// Your functions here
// -------------------

const countLoopsOf3WithT = (nodes: Nodes): number => {
    const loops = new Set();

    for (const [node1, neighbors] of Object.entries(nodes)) {
        for (const node2 of neighbors) {
            for (const node3 of nodes[node2]) {
                if (
                    nodes[node3].some((neighbor) => node1 === neighbor) &&
                    [node1, node2, node3].some((node) => node.charAt(0) === "t")
                ) {
                    loops.add([node1, node2, node3].sort().join(""));
                }
            }
        }
    }

    return loops.size;
};

const checkSet = (set: string[], nodes: Nodes) =>
    set.every(
        (node) =>
            set.every(
                (node2) => node === node2 || nodes[node].some((neighbor) => neighbor === node2),
            ),
    );

/** Recursive function to find largest set starting with given set elements
 *
 * @param set Starting set elements, function will try to expand it
 * @param nodes Nodes dictionary
 * @returns Largest set with including starting set
 */
const findLargerSet = (set: string[], nodes: Nodes): string[] => {
    const lastNode = set[set.length - 1];

    let largestSet = set;

    for (const neighbor of nodes[lastNode]) {
        if (neighbor > lastNode) {
            // Check neighbor is part of set
            let setCandidate = [...set, neighbor];
            const setKey = setCandidate.join(",");

            if (checkSet(setCandidate, nodes)) {
                // New set found ! Try to expand this set...
                setCandidate = findLargerSet(setCandidate, nodes);

                if (setCandidate.length > largestSet.length) {
                    largestSet = setCandidate;
                }
            }
        }
    }

    return largestSet;
};

const findLargestComputerSet = (nodes: Nodes): string => {
    // Sort node's neighbors alphabetically
    for (const node of Object.keys(nodes)) {
        nodes[node] = nodes[node].sort();
    }

    const exploredNodes = new Set();

    let largestSet: string[] = [];

    for (const node of Object.keys(nodes).sort()) {
        if (!exploredNodes.has(node)) {
            const largestNodeSet = findLargerSet([node], nodes);
            for (const setNode of largestNodeSet) {
                exploredNodes.add(setNode);
            }
            if (largestNodeSet.length > largestSet.length) {
                largestSet = largestNodeSet;
            }
        }
    }

    return largestSet.join(",");
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => countLoopsOf3WithT(inputNodes);

const problem2: Solver = () => findLargestComputerSet(inputNodes);

// ---------------
// Display answers
// ---------------

// solveWithLogs(problem1, 1);
// Tries:
// - 1173 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - cm,de,ez,gv,hg,iy,or,pw,qu,rs,sn,uc,wq => Correct !
