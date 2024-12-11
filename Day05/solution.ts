import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

type InputLine = string;

// Switch inputs here
const USE_TEST_INPUT = Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const [pageOrderingRules, pagesToProduce] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n\n");

const rules = pageOrderingRules.split("\n");
const pagesToProduceLines = pagesToProduce.split("\n");

const rulesMap = new Map();
for (const rule of rules) rulesMap.set(rule, 1);

// -------------------
// Your functions here
// -------------------

const checkLine = (line: string): number => {
    const pages = line.split(",");

    for (const [index, page1] of pages.entries()) {
        if (
            pages.slice(index + 1).some((page2) => !rulesMap.has(`${page1}|${page2}`))
        ) {
            return 0;
        }
    }

    return +pages[(pages.length - 1) / 2];
};

const checkAndFixLine = (line: string): number => {
    const pages = line.split(",");

    if (!checkLine(line)) {
        pages.sort((page1, page2) => rulesMap.has(`${page1}|${page2}`) ? 1 : -1);

        return +pages[(pages.length - 1) / 2];
    }

    return 0;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () =>
    pagesToProduceLines.reduce(
        (sum, pagesToProduceLine) => sum + checkLine(pagesToProduceLine),
        0,
    );

const problem2: Solver = () =>
    pagesToProduceLines.reduce(
        (sum, pagesToProduceLine) => sum + checkAndFixLine(pagesToProduceLine),
        0,
    );
// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);

solveWithLogs(problem2, 2);
