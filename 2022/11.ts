import { dataString } from "./data/11.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testString = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

type MonkeyData = {
  index: number;
  items: string[];
  operation: {
    left: "old" | number;
    right: "old" | number;
    operator: "*" | "+";
  };
  divisableBy: number;
  destinations: {
    true: number;
    false: number;
  };
  inspectionCount: number;
};

const parseIntIfNotOld = (input: string) =>
  input === "old" ? input : parseInt(input);

const parseMonkeyData = (input: string): MonkeyData => {
  const [indexLine, itemsLine, operationLine, testLine, trueLine, falseLine] =
    input.split("\n");

  const [_, left, operator, right] = operationLine.match(
    /\s(\S*)\s(\+|\*)\s(\S*)$/,
  ) || [];

  const data: MonkeyData = {
    index: parseInt(indexLine.match(/\d/)?.at(0) || ""),
    items: itemsLine.match(/\d{2}/g) || [],
    operation: {
      left: parseIntIfNotOld(left),
      right: parseIntIfNotOld(right),
      operator: operator === "+" ? "+" : "*",
    },
    divisableBy: parseInt(testLine.split(" ").at(-1) || ""),
    destinations: {
      true: parseInt(trueLine.split(" ").at(-1) || ""),
      false: parseInt(falseLine.split(" ").at(-1) || ""),
    },
    inspectionCount: 0,
  };

  // console.log(data);

  return data;
};

const parse = (input: string): MonkeyData[] => {
  return input.split("\n\n").map(parseMonkeyData);
};

const doOperation = (x: number, operation: MonkeyData["operation"]) => {
  const l = operation.left === "old" ? x : operation.left;
  const r = operation.right === "old" ? x : operation.right;

  return operation.operator === "*" ? l * r : l + r;
};
const doBigOperation = (x: string, operation: MonkeyData["operation"]) => {
  const l = BigInt(operation.left === "old" ? x : operation.left);
  const r = BigInt(operation.right === "old" ? x : operation.right);

  return operation.operator === "*" ? l * r : l + r;
};

const partOne = (input: string, rounds: number) => {
  const monkeys = parse(input);

  for (let index = 0; index < rounds; index++) {
    monkeys.forEach((monkey) => {
      monkey.items.forEach((item) => {
        const result = doOperation(parseInt(item), monkey.operation);
        const rounded = Math.floor(result / 3);

        const x = rounded % monkey.divisableBy === 0;

        const destinationIndex = monkey.destinations[x ? "true" : "false"];
        const destination = monkeys[destinationIndex];

        console.log({
          monkey: monkey.index,
          item,
          result,
          rounded,
          destinationIndex,
        });

        monkey.inspectionCount += 1;

        destination?.items.push(String(rounded));
      });
      monkey.items = [];
    });
  }

  const [one, two] = monkeys.sort((a, b) =>
    b.inspectionCount - a.inspectionCount
  );

  return one.inspectionCount * two.inspectionCount;
};

Deno.test("part one", () => {
  assertEquals(partOne(testString, 20), 10605);
  assertEquals(partOne(dataString, 20), 57838);
});

const partTwo = (input: string, rounds: number) => {
  const monkeys = parse(input);
  const superModulo = monkeys.map((monkey) => monkey.divisableBy).reduce(
    (a, b) => a * b,
    1,
  );

  for (let index = 0; index < rounds; index++) {
    console.log(index);
    monkeys.forEach((monkey) => {
      monkey.items.forEach((item) => {
        const result = doOperation(parseInt(item), monkey.operation);
        const rounded = result % superModulo;

        const x = rounded % monkey.divisableBy === 0;

        const destinationIndex = monkey.destinations[x ? "true" : "false"];
        const destination = monkeys[destinationIndex];

        monkey.inspectionCount += 1;

        destination?.items.push(String(rounded));
      });
      monkey.items = [];
    });
  }

  const sorted = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);

  const [one, two] = sorted;
  return one.inspectionCount * two.inspectionCount;
};

Deno.test("part two", () => {
  assertEquals(partTwo(testString, 10000), 2713310158);
  assertEquals(partTwo(dataString, 10000), 15050382231);
});
