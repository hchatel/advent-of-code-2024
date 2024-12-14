import { solveWithLogs } from "../utils/logs.ts";
import { Solver } from "../utils/types.ts";

// --------------
// Problem Inputs
// --------------

interface Robot {
    position: [number, number];
    velocity: [number, number];
}

// Switch inputs here manually or using --test option in cmd line
const USE_TEST_INPUT = false ||
    Deno.args.some((arg) => ["-t", "--test"].includes(arg));

// Read file
const inputFilename = USE_TEST_INPUT ? "inputTest.txt" : "input.txt";
const [WIDTH, HEIGHT] = USE_TEST_INPUT ? [11, 7] : [101, 103];

const regex = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/;

const parse = (line: string): Robot => {
    const matches = line.match(regex);

    if (!matches) {
        throw new Error(`Failed to parse line: ${line}`);
    }

    return {
        position: [+matches[1], +matches[2]],
        velocity: [+matches[3], +matches[4]],
    };
};

const inputRobots: Robot[] = Deno.readTextFileSync(
    `${import.meta.dirname}/${inputFilename}`,
).split("\n").filter(Boolean).map(parse);

// -------------------
// Your functions here
// -------------------

const wait = (robots: Robot[], time: number): Robot[] => {
    const futurRobots: Robot[] = [];

    for (const robot of robots) {
        const { position, velocity } = robot;

        const futurPosition: [number, number] = [...position];

        // Fast forward
        futurPosition[0] = (position[0] + time * velocity[0]) % WIDTH;
        futurPosition[1] = (position[1] + time * velocity[1]) % HEIGHT;

        if (futurPosition[0] < 0) futurPosition[0] += WIDTH;
        if (futurPosition[1] < 0) futurPosition[1] += HEIGHT;

        futurRobots.push({ position: futurPosition, velocity });
    }

    return futurRobots;
};

const countQuadrants = (robots: Robot[]): number => {
    let QTL = 0;
    let QTR = 0;
    let QBL = 0;
    let QBR = 0;

    const halfWidth = (WIDTH - 1) / 2;
    const halfHeihgt = (HEIGHT - 1) / 2;

    for (const robot of robots) {
        if (robot.position[0] < halfWidth) {
            if (robot.position[1] < halfHeihgt) {
                QTL++;
            }
            if (robot.position[1] > halfHeihgt) {
                QTR++;
            }
        }
        if (robot.position[0] > halfWidth) {
            if (robot.position[1] < halfHeihgt) {
                QBL++;
            }
            if (robot.position[1] > halfHeihgt) {
                QBR++;
            }
        }
    }

    return QTL * QTR * QBL * QBR;
};

const getRobotPicture = (robots: Robot[]): string => {
    const robotMap = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => "."));

    for (const robot of robots) {
        robotMap[robot.position[1]][robot.position[0]] = "#";
    }

    return robotMap.map((line) => line.join("")).join("\n");
};

// -------------
// Solve problem
// -------------

const problem1: Solver = () => {
    const futurRobots = wait(inputRobots, 100);

    return countQuadrants(futurRobots);
};

const waitAndDisplay = (t: number) => {
    const futurRobots = wait(inputRobots, t);
    console.log(`########### Step ${t} ###########`);
    console.log(getRobotPicture(futurRobots));
    setTimeout(() => waitAndDisplay(t + 1), 500);
};

const problem2: Solver = () => {
    // waitAndDisplay(5469);

    // Write every steps to check in a file
    const encoder = new TextEncoder();

    for (let t = 5469; t < 10000; t++) {
        const picture = `######### Step ${t} #########\n${getRobotPicture(wait(inputRobots, t))}\n`;
        Deno.writeFileSync("snow.txt", encoder.encode(picture), { append: true });
    }

    return 0;
};

// ---------------
// Display answers
// ---------------

solveWithLogs(problem1, 1);
// Tries:
// - 226236192

solveWithLogs(problem2, 2);
// Tries:
// - 1000 => Too Low
// - 10000 => Too High
// - 5000 => Too Low
// - 8168 => Correct
