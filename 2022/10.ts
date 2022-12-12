import { dataString } from "./data/10.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testString = `noop
addx 3
addx -5`;

const testString2 = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const parse = (input: string): [string, number][] => {
  return input.split("\n").map((l) => {
    const [operator, parameter] = l.split(" ");

    return [operator, parseInt(parameter)];
  });
};

const partOne = (input: ReturnType<typeof parse>, cycleCount: number) => {
  let X = 1;
  let cycle = 1;
  for (let index = 0; cycle < cycleCount; index++) {
    const [operator, parameter] = input[index % input.length];

    if (operator === "addx") {
      cycle += 2;
      if (cycle > cycleCount) {
        break;
      }
      X = X + parameter;
    } else if (operator === "noop") {
      cycle += 1;
    }
  }

  return X * cycleCount;
};

const runForCycles = (input: ReturnType<typeof parse>, counts: number[]) => {
  const strengths = counts.map((c) => partOne(input, c));

  return mod.sumOf(strengths, (x) => x);
};

Deno.test("part one", () => {
  // assertEquals(partOne(parse(testString), 5), -1);
  assertEquals(partOne(parse(testString2), 20), 420);
  assertEquals(partOne(parse(testString2), 60), 1140);
  assertEquals(partOne(parse(testString2), 100), 1800);
  assertEquals(partOne(parse(testString2), 100), 1800);
  assertEquals(partOne(parse(testString2), 140), 2940);
  assertEquals(partOne(parse(testString2), 180), 2880);
  assertEquals(partOne(parse(testString2), 220), 3960);
  assertEquals(
    runForCycles(parse(testString2), [20, 60, 100, 140, 180, 220]),
    13140,
  );
  assertEquals(
    runForCycles(parse(dataString), [20, 60, 100, 140, 180, 220]),
    13220,
  );
});

const increaseCycle = (
  cycle: number,
  count: number,
  X: number,
) => {
  let s = "";
  const spritePositions = [X - 1, X, X + 1];
  console.log(spritePositions);
  for (let index = 0; index < count; index++) {
    const pos = (cycle + index - 1) % 40;

    console.log({ cycle, pos, count });

    if (cycle !== 1 && pos === 0) {
      s += "\n";
    }

    if (spritePositions.includes(pos)) {
      s += "#";
    } else {
      s += ".";
    }
  }

  return s;
};

const partTwo = (input: ReturnType<typeof parse>, cycleCount: number) => {
  let output = "";
  let X = 1;
  let cycle = 1;
  for (let index = 0; cycle < cycleCount; index++) {
    const [operator, parameter] = input[index % input.length];

    if (operator === "addx") {
      output += increaseCycle(cycle, 2, X);
      cycle += 2;
      if (cycle > cycleCount) {
        break;
      }
      X = X + parameter;
    } else if (operator === "noop") {
      output += increaseCycle(cycle, 1, X);
      cycle += 1;
    }
  }

  console.log(output);

  return output;
};

Deno.test("hello", () => {
  assertEquals(partTwo(parse(testString2), 21), "##..##..##..##..##..#");
  assertEquals(
    "\n" + partTwo(parse(dataString), 240),
    `
###..#..#..##..#..#.#..#.###..####.#..#.
#..#.#..#.#..#.#.#..#..#.#..#.#....#.#..
#..#.#..#.#..#.##...####.###..###..##...
###..#..#.####.#.#..#..#.#..#.#....#.#..
#.#..#..#.#..#.#.#..#..#.#..#.#....#.#..
#..#..##..#..#.#..#.#..#.###..####.#..#`,
  );
});
