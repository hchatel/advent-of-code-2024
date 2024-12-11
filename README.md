# Advent of Code

Template to solve [Advent of code](https://adventofcode.com/2024) easily with typescript and TDD (if you wish).

# Init project

1. [Install Deno](https://docs.deno.com/runtime/)

2. Check you have deno installed

```bash
$ deno -v
```

You're set !

# For each day

- Copy template for that day

```bash
$ deno task new Day01
```

- Copy your test inputs into generated texts files

- Run the solution

```bash
$ deno run --allow-read Day01/solution.ts
# Or
$ deno task run Day01

# To run with test input:

$ deno task run Day01 --test
$ deno task run Day01 -t
```

# Other commands

## Run tests

```bash
$ deno test --allow-read Day01
```

## Format the code

```bash
$ deno fmt
```
