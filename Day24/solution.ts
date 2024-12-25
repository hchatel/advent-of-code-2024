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
const [wireLines, gateLines] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n\n");

// Parse input
type State = 0 | 1;
type Wires = Map<string, State>;

type Operator = "AND" | "OR" | "XOR";

interface Gate {
    a: string;
    b: string;
    op: Operator;
    out: string;
}

const parseInput = (): [Wires, Gate[]] => {
    const wiresMap: Wires = new Map();
    for (const wireLine of wireLines.split("\n")) {
        const [key, value] = wireLine.split(": ");
        wiresMap.set(key, value === "1" ? 1 : 0);
    }

    const gates: Gate[] = [];
    for (const gateLine of gateLines.split("\n").filter(Boolean)) {
        const matches = gateLine.match(/(...) (...?) (...) -> (...)/);
        gates.push({
            a: matches?.[1] ?? "",
            op: (matches?.[2] ?? "AND") as Operator,
            b: matches?.[3] ?? "",
            out: matches?.[4] ?? "",
        });
    }

    return [wiresMap, gates];
};

// -------------------
// Your functions here
// -------------------

const getValue = (a: State, b: State, op: Operator): State => {
    switch (op) {
        case "AND":
            return a && b;
        case "OR":
            return a || b;
        case "XOR":
            return (a ^ b) as State;
        default:
            return 0;
    }
};

let zKeys: string[] = [];

const computeResult = (wires: Wires): number => {
    let binary = "";
    if (!zKeys.length) {
        zKeys = [...wires.keys().filter((key) => key.charAt(0) === "z")].sort();
    }
    for (const wire of zKeys) {
        binary = `${wires.get(wire)}${binary}`;
    }

    return parseInt(binary, 2);
};

const runGates = (wires: Wires, gates: Gate[]) => {
    while (gates.length) {
        let i = 0;
        while (!(wires.has(gates[i].a) && wires.has(gates[i].b))) {
            i++;
        }

        const gate = gates.splice(i, 1)[0];

        wires.set(gate.out, getValue(wires.get(gate.a)!, wires.get(gate.b)!, gate.op));
    }
};

const computeXandY = (wires: Wires): [number, number] => {
    let xBinary = "";
    let yBinary = "";

    for (const wire of wires.keys()) {
        if (wire.charAt(0) === "x") {
            xBinary = `${wires.get(wire)}${xBinary}`;
        } else {
            yBinary = `${wires.get(wire)}${yBinary}`;
        }
    }

    return [parseInt(xBinary, 2), parseInt(yBinary, 2)];
};

type Swaps = [number, number, number, number, number, number, number, number];

const getResult = (wires: Wires, gates: Gate[]): number => {
    const checkWires = new Map(wires);

    // Check result
    runGates(checkWires, gates);

    return computeResult(checkWires);
};

const numToBin = (num: number): string => (num >>> 0).toString(2);

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    const [wires, gates] = parseInput();

    return getResult(wires, gates);
};

const problem2: Solver = () => {
    const [wires, gates] = parseInput();

    const [x, y] = computeXandY(wires);
    const expectedBinary = numToBin(x + y);
    const result = numToBin(getResult(wires, gates));

    // Run through bits to find the ones to flip
    for (let i = expectedBinary.length; i >= 0; i--) {
        if (expectedBinary[i] !== result[i]) {
            console.log("Wrong bit at", i);
        }
    }

    console.log(expectedBinary);
    // console.log((y >>> 0).toString(2));
    console.log(result);

    return -1;
};

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 51107420031718 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// -
