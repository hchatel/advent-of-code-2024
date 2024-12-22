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
const secretNumbers: number[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean).map((str) => +str);

// -------------------
// Your functions here
// -------------------

// 32 = 2 ** 5
// 64 = 2 ** 6
// 2048 = 2 ** 11
// 16777216 = 2**24

const mix = (number: number, secret: number): number => number ^ secret;

const prune = (secret: number): number => {
    const result = secret % 16777216;

    return result > 0 ? result : result + 16777216;
};

const nextSecret = (secret: number): number => {
    // mult by 64, mix, prune
    secret = prune(mix(secret * 64, secret));
    // div by 32, mix, prune
    secret = prune(mix(secret / 32, secret));
    // mult by 2048, mix, prune
    secret = prune(mix(secret * 2048, secret));

    return secret;
};

const predictNthGeneration = (secret: number, gen: number): number => {
    let g = 0;
    let price = secret % 10;
    while (g++ < gen) {
        secret = nextSecret(secret);
        const newPrice = secret % 10;
        console.log({ secret, price, priceDiff: secret % 10 - price });
        price = newPrice;
    }

    console.log(g, secret);

    return secret;
};

const findBestOutcome = (secrets: number[]) => {
    const firstSequencesScore = new Map<string, number>();
    let maxScore = 0;

    for (let secret of secrets) {
        const firstSequences = new Set();
        let generation = 0;
        let price = secret % 10;
        const priceDiffs = [];
        while (generation < 2000) {
            secret = nextSecret(secret);
            const newPrice = secret % 10;
            priceDiffs.push(secret % 10 - price);
            price = newPrice;
            if (priceDiffs.length > 4) {
                const key = JSON.stringify(priceDiffs.slice(-4));
                if (!firstSequences.has(key)) {
                    firstSequences.add(key);
                    const newScore = (firstSequencesScore.get(key) ?? 0) + newPrice;
                    firstSequencesScore.set(key, newScore);
                    if (newScore > maxScore) maxScore = newScore;
                }
            }
            generation++;
        }
    }

    return maxScore;
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => secretNumbers.reduce((sum, secret) => sum + predictNthGeneration(secret, 2000), 0);

const problem2: Solver = () => findBestOutcome(secretNumbers);

// ---------------
// Display answers
// ---------------

// solveWithLogs(problem1, 1);
// Tries:
// - 14082561342 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// - 1568 => Correct !
