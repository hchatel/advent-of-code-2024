import { Solver } from "./types.ts";

/**
 * Wraps the solver to add some logs, like execution time.
 *
 * @param solver Function solving the problem. Takes no argument and returns number or string.
 * @param problemIndex Index of the problem, 1 or 2
 */
export const solveWithLogs = (solver: Solver, problemIndex: 1 | 2) => {
    console.log(`\n### Solving problem n°${problemIndex}...\n`);

    const timerLabel = "  Execution time";
    console.time(timerLabel);

    const returnValue = solver();

    console.info(`  Answer:`);
    console.info("  -------------------------------------------------");
    console.info(" ", returnValue);
    console.info("  -------------------------------------------------");

    console.timeEnd(timerLabel);

    console.info("\n");
};
