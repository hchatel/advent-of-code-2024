import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { Computer } from "./solution.ts";

describe("Dummy conditions", () => {
    it("Does nothing without instructions", () => {
        const computer = new Computer({
            A: 0,
            B: 0,
            C: 0,
            instructions: [],
        });

        expect(computer.run()).toBe("");
    });

    it("Throws if 7 is used as a combo operand", () => {
        const computer = new Computer({
            A: 0,
            B: 0,
            C: 0,
            instructions: [0, 7],
        });

        expect(() => computer.run()).toThrow();
    });
});

describe("adv operation", () => {
    it("stores truncated value of A divided by the combo of operand to the of 2 in A", () => {
        const computer = new Computer({
            A: 9,
            B: 0,
            C: 0,
            instructions: [0, 2],
        });

        computer.run();

        expect(computer.getA()).toBe(2);
    });
});

describe("bxl operation", () => {
    it("stores B XOR operand in B", () => {
        const computer = new Computer({
            A: 0,
            B: 2,
            C: 0,
            instructions: [1, 4],
        });

        computer.run();

        expect(computer.getB()).toBe(6);
    });
});

describe("bst operation", () => {
    it("stores operand modulo 8 in B", () => {
        const computer = new Computer({
            A: 0,
            B: 0,
            C: 0,
            instructions: [2, 9],
        });

        computer.run();

        expect(computer.getB()).toBe(1);
    });
});

describe("jnz operation", () => {
    it("does nothing if A is 0", () => {
        const computer = new Computer({
            A: 0,
            B: 0,
            C: 0,
            instructions: [3, 6],
        });

        computer.run();

        expect(computer.getCursor()).toBe(2);
    });

    it("move cursor to operand if A is not zero", () => {
        const computer = new Computer({
            A: 1,
            B: 0,
            C: 0,
            instructions: [3, 6],
        });

        computer.run();

        expect(computer.getCursor()).toBe(6);
    });
});

describe("bxc operation", () => {
    it("stores B XOR C in B", () => {
        const computer = new Computer({
            A: 0,
            B: 2,
            C: 4,
            instructions: [4, 3],
        });

        computer.run();

        expect(computer.getB()).toBe(6);
    });
});

describe("out operation", () => {
    it("outputs combo operand modulo 8", () => {
        const computer = new Computer({
            A: 12,
            B: 0,
            C: 0,
            instructions: [5, 4],
        });

        computer.run();

        expect(computer.run()).toBe("4");
    });
});

describe("bdv operation", () => {
    it("stores truncated value of A divided by the combo of operand to the of 2 in B", () => {
        const computer = new Computer({
            A: 13,
            B: 0,
            C: 0,
            instructions: [6, 3],
        });

        computer.run();

        expect(computer.getB()).toBe(1);
    });
});

describe("cdv operation", () => {
    it("stores truncated value of A divided by the combo of operand to the of 2 in C", () => {
        const computer = new Computer({
            A: 13,
            B: 0,
            C: 0,
            instructions: [7, 3],
        });

        computer.run();

        expect(computer.getC()).toBe(1);
    });
});

describe.only("test cases", () => {
    it("runs test 1", () => {
        const computer = new Computer({
            A: 0,
            B: 0,
            C: 9,
            instructions: [2, 6],
        });
        computer.run();
        expect(computer.getB()).toBe(1);
    });
    it("runs test 2", () => {
        const computer = new Computer({
            A: 10,
            B: 0,
            C: 0,
            instructions: [5, 0, 5, 1, 5, 4],
        });
        expect(computer.run()).toBe("0,1,2");
    });
    it("runs test 3", () => {
        const computer = new Computer({
            A: 2024,
            B: 0,
            C: 0,
            instructions: [0, 1, 5, 4, 3, 0],
        });
        expect(computer.run()).toBe("4,2,5,6,7,7,7,7,3,1,0");
        expect(computer.getA()).toBe(0);
    });
    it("runs test 4", () => {
        const computer = new Computer({
            A: 0,
            B: 29,
            C: 0,
            instructions: [1, 7],
        });
        computer.run();
        expect(computer.getB()).toBe(26);
    });
    it("runs test 5", () => {
        const computer = new Computer({
            A: 0,
            B: 2024,
            C: 43690,
            instructions: [4, 0],
        });
        computer.run();
        expect(computer.getB()).toBe(44354);
    });
});
