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
).split("\n");

interface InputData {
    A: number;
    B: number;
    C: number;
    instructions: number[];
}

const parse = (inputLines: string[]): InputData => {
    const A = +inputLines[0].split(": ")[1];
    const B = +inputLines[1].split(": ")[1];
    const C = +inputLines[2].split(": ")[1];

    const instructions = inputLines[4].split(": ")[1].split(",").map(Number);

    return {
        A,
        B,
        C,
        instructions,
    };
};

// -------------------
// Your functions here
// -------------------

const resultsMap = new Map<string, number>();

export class Computer {
    private A: number;
    private B: number;
    private C: number;
    private instructions: number[];
    private output: number[] = [];
    private cursor = 0;
    private identicalOutput;

    constructor(input: InputData, expectIndenticalOutput = false) {
        this.A = input.A;
        this.B = input.B;
        this.C = input.C;
        this.instructions = input.instructions;
        this.identicalOutput = expectIndenticalOutput;
    }

    private combo = (value: number): number => {
        if (value === 4) return this.A;
        if (value === 5) return this.B;
        if (value === 6) return this.C;
        if (value === 7) {
            throw new Error("7 is reserved, program invalid");
        }

        return value;
    };

    private dv = (denum: number): number => {
        // const key = `${this.A},${denum}`;
        // if (resultsMap.has(key)) {
        //     return resultsMap.get(key)!;
        // }
        // const result = Math.trunc(this.A / 2 ** denum);
        // resultsMap.set(key, result);
        // =>  RangeError: Map maximum size exceeded

        return Math.trunc(this.A / 2 ** denum);
    };

    private adv = (operand: number) => {
        this.A = this.dv(this.combo(operand));
    };

    private bxl = (operand: number) => {
        this.B = operand ^ this.B;
    };

    private bst = (operand: number) => {
        this.B = this.combo(operand) % 8;
    };

    private jnz = (operand: number): boolean => {
        if (this.A === 0) return true;
        this.cursor = operand;

        return false;
    };

    private bxc = () => {
        this.B = this.C ^ this.B;
    };

    private out = (operand: number): boolean => {
        const result = this.combo(operand) % 8;
        const sameAsInput = result === this.instructions[this.output.length];

        if (!this.identicalOutput || sameAsInput) {
            this.output.push(result);

            return true;
        }

        return false;
    };

    private bdv = (operand: number) => {
        this.B = this.dv(this.combo(operand));
    };

    private cdv = (operand: number) => {
        this.C = this.dv(this.combo(operand));
    };

    private runStep = (): boolean => {
        const opcode = this.instructions[this.cursor];
        const operand = this.instructions[this.cursor + 1];
        // console.log("Run step", opcode, operand, { A: this.A, B: this.B, C: this.C, output: this.output });

        let incCursor = true;

        switch (opcode) {
            case 0:
                this.adv(operand);
                break;
            case 1:
                this.bxl(operand);
                break;
            case 2:
                this.bst(operand);
                break;
            case 3:
                incCursor = this.jnz(operand);
                break;
            case 4:
                this.bxc();
                break;
            case 5:
                this.cursor += 2;
                return this.out(operand);
            case 6:
                this.bdv(operand);
                break;
            case 7:
                this.cdv(operand);
                break;
        }

        if (incCursor) this.cursor += 2;

        return true;
    };

    public getA = () => this.A;
    public getB = () => this.B;
    public getC = () => this.C;
    public getCursor = () => this.cursor;

    public run = (): string => {
        let continueComputing = true;
        while (continueComputing && this.cursor < this.instructions.length) {
            continueComputing = this.runStep();
        }

        return this.output.join(",");
    };
}

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    const inputData = parse(inputLines);

    const computer = new Computer(inputData);

    return computer.run();
};

const problem2: Solver = () => {
    const inputData = parse(inputLines);
    const instructions = inputLines[4].split(": ")[1];

    let A = 0;
    let AStep = 1;
    let bestMatchLength = 0;
    let prevBest = 0;
    let steps = 1;

    let computer = new Computer({ ...inputData, A }, true);
    let output = computer.run();
    const start = Date.now();

    while (output !== instructions) {
        const outputLength = output === "" ? 0 : output.split(",").length;

        if (outputLength > bestMatchLength) {
            bestMatchLength = outputLength;
            if (prevBest > 0) {
                AStep = A - prevBest;
                // console.log("   => Update step to ", AStep);
            }
            prevBest = A;
            console.log(
                { A, AStep, output },
                output.split(",").length,
                " identical digits, after",
                steps,
                "steps in",
                Date.now() - start,
                "ms",
            );
            steps = 0;
        } else if (outputLength === bestMatchLength && prevBest > 0) {
            AStep = A - prevBest;
            // console.log(A, output, "=> Update step to ", AStep);
            prevBest = -1;
        }

        // console.log("A: ", A, "=>", output);

        A += AStep;
        steps++;
        computer = new Computer({ ...inputData, A }, true);
        output = computer.run();
    }

    return A;
};
// 15 2 2,4 => Best so far !
// 527 3 2,4,7 => Best so far !
// 1039 4 2,4,1,5 => Best so far !
// 8177 5 2,4,1,2,4 => Best so far !
// 80911 6 2,4,1,2,7,5 => Best so far !
// 343055 7 2,4,1,2,7,5,4 => Best so far !
// 17120271 8 2,4,1,2,7,5,4,7 => Best so far !
// 56441871 9 2,4,1,2,7,5,4,5,7 => Best so far !
// 100000000 1 5
// 200000000 1 5
// 223362063 10 2,4,1,2,7,5,4,5,0,4 => Best so far !

// First output of length 16 around 35184372085000, starting search from their !
// 35184372085001 1 -3 => Best so far !
// 35184372088839 2 2,5 => Best so far !
// 35184372088847 3 2,4,5 => Best so far !
// 35184372089871 4 2,4,1,5 => Best so far !
// 35184372100111 5 2,4,1,2,5 => Best so far !
// 35184372104207 7 2,4,1,2,7,5,5 => Best so far !
// 35184372431887 9 2,4,1,2,7,5,4,5,5 => Best so far !
// 35184461233167 10 2,4,1,2,7,5,4,5,0,5 => Best so far !
// 35185266539535 11 2,4,1,2,7,5,4,5,0,3,5 => Best so far !
// 35185400000000 1 5

// New method: update step size after each found digit:
// { A: 7, AStep: 1, output: "2" } 1 => Best so far ! After 7 steps in 0 ms
// { A: 15, AStep: 8, output: "2,4" } 2 => Best so far ! After 8 steps in 3 ms
// { A: 1039, AStep: 512, output: "2,4,1" } 3 => Best so far ! After 65 steps in 3 ms
// { A: 11279, AStep: 2048, output: "2,4,1,2" } 4 => Best so far ! After 8 steps in 3 ms
// { A: 15375, AStep: 4096, output: "2,4,1,2,7" } 5 => Best so far ! After 2 steps in 4 ms
// { A: 80911, AStep: 65536, output: "2,4,1,2,7,5" } 6 => Best so far ! After 16 steps in 4 ms
// { A: 343055, AStep: 262144, output: "2,4,1,2,7,5,4" } 7 => Best so far ! After 4 steps in 4 ms
// { A: 67451919, AStep: 16777216, output: "2,4,1,2,7,5,4,5" } 8 => Best so far ! After 67 steps in 5 ms
// { A: 1141193743, AStep: 67108864, output: "2,4,1,2,7,5,4,5,0" } 9 => Best so far ! After 19 steps in 5 ms
// { A: 1543846927, AStep: 134217728, output: "2,4,1,2,7,5,4,5,0,3" } 10 => Best so far ! After 4 steps in 6 ms
// { A: 1418883054607, AStep: 402653184, output: "2,4,1,2,7,5,4,5,0,3,1" } 11 => Best so far ! After 3522 steps in 18 ms
// { A: 8015952821263, AStep: 824633720832, output: "2,4,1,2,7,5,4,5,0,3,1,7" } 12 => Best so far ! After 2055 steps in 22 ms
// ---------------
// Display answers
// ---------------

// solveWithLogs(problem1, 1);
// Tries:
// - 4,3,7,1,5,3,0,5,4 => Correct !

solveWithLogs(problem2, 2);
// Tries:
// -
