import { dataString } from "./data/05.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testString = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const parseStacks = (input: string) => {
  const lines = input.split("\n");

  const stacks = lines.slice(0, lines.length - 1);

  return stacks.reduce((p, c) => {
    const x = Array.from(c.match(/(\s{4}|\w{1})/g) || []);

    x.forEach((e, i) => {
      if (e.trim()) {
        if (!p[i + 1]) {
          p[i + 1] = [];
        }
        p[i + 1] = [e, ...p[i + 1]];
      }
    });

    return p;
  }, {} as Record<string, string[]>);
};

Deno.test("stacks", () => {
  assertEquals(
    parseStacks(`    [D]    
[N] [C]    
[Z] [M] [P]
1   2   3 `),
    { 1: ["Z", "N"], 2: ["M", "C", "D"], 3: ["P"] },
  );
});

const parseMovements = (input: string) => {
  return input.split("\n").map((l) => {
    const [amount, from, to] = Array.from(l.match(/(\d+)/g) || []);

    return { amount: parseInt(amount), from: parseInt(from), to: parseInt(to) };
  });
};

Deno.test("parseMovements", () => {
  assertEquals(
    parseMovements(`move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`),
    [{ amount: 1, from: 2, to: 1 }, { amount: 3, from: 1, to: 3 }, {
      amount: 2,
      from: 2,
      to: 1,
    }, { amount: 1, from: 1, to: 2 }],
  );
  assertEquals(
    parseMovements(`move 14 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`),
    [{ amount: 14, from: 2, to: 1 }, { amount: 3, from: 1, to: 3 }, {
      amount: 2,
      from: 2,
      to: 1,
    }, { amount: 1, from: 1, to: 2 }],
  );
});

const applyMovements = (
  stacksInput: ReturnType<typeof parseStacks>,
  movements: ReturnType<typeof parseMovements>,
  reverse?: boolean,
) => {
  const stacks = { ...stacksInput };

  movements.forEach(({ amount, from, to }) => {
    const origin = stacks[from];
    const toMove = origin.slice(origin.length - amount);
    stacks[from] = origin.slice(0, origin.length - amount);

    const destination = stacks[to];

    stacks[to] = destination.concat(reverse ? toMove.reverse() : toMove);
  });

  return stacks;
};

const getStackTopString = (stacks: ReturnType<typeof parseStacks>) => {
  return Object.values(stacks).reduce((p, c) => {
    return p + c.at(-1);
  }, "");
};

const partOne = (input: string) => {
  const [s, m] = input.split("\n\n");

  const stacks = parseStacks(s);
  const movements = parseMovements(m);

  const movedStacks = applyMovements(stacks, movements, true);

  return getStackTopString(movedStacks);
};

const partTwo = (input: string) => {
  const [s, m] = input.split("\n\n");

  const stacks = parseStacks(s);
  const movements = parseMovements(m);

  const movedStacks = applyMovements(stacks, movements);

  return getStackTopString(movedStacks);
};

Deno.test("partOne", () => {
  assertEquals(partOne(testString), "CMZ");
  assertEquals(partOne(dataString), "QNHWJVJZW");
});
Deno.test("partTwo", () => {
  assertEquals(partTwo(testString), "MCD");
  assertEquals(partTwo(dataString), "BPCZJLFJW");
});
