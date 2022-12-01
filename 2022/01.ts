import { dataString } from "./data/01.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testData = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

const parseData = (data: string) => {
  const groups = data.split("\n\n");

  const parsedGroups = groups.map((group) => {
    const parsedGroup = group.split("\n").map(Number);
    return parsedGroup;
  });

  return parsedGroups;
};

const sumGroup = (group: number[]) => {
  const sum = mod.sumOf(group, (x) => x);
  return sum;
};

const getSortedCalories = (input: string) => {
  const summed = parseData(input).map(sumGroup);

  const sorted = summed.sort((a, b) => b - a);

  return sorted;
};

const solvePart1 = (input: string) => {
  return getSortedCalories(input)[0];
};

const solvePart2 = (input: string) => {
  const [one, two, three] = getSortedCalories(input);

  return one + two + three;
};

Deno.test("testData", () => {
  assertEquals(solvePart1(testData), 24000);
  assertEquals(solvePart2(testData), 45000);
});

console.log("part 1", solvePart1(dataString));
console.log("part 2", solvePart2(dataString));
