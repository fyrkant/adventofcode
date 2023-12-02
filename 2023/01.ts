import { dataString } from "./data/01.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testInput = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const parseLine = (input: string) => {
  const nums = input.split("").filter((x) => {
    return /[0-9]/.test(x);
  });

  return nums;
};

const vals = {
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "nine": "9",
};

const findFirstorLast = (position: "first" | "last") => (input: string) => {
  let i = position === "first" ? Infinity : -Infinity;
  let v = "";

  Object.entries(vals).forEach(([s, n]) => {
    const si = position === "first" ? input.indexOf(s) : input.lastIndexOf(s);

    if (si !== -1 && (position === "first" ? si < i : si > i)) {
      i = si;
      v = n;
    }
  });

  Object.values(vals).forEach((n) => {
    const ni = position === "first" ? input.indexOf(n) : input.lastIndexOf(n);

    if (ni !== -1 && (position === "first" ? ni < i : ni > i)) {
      i = ni;
      v = n;
    }
  });

  return v;
};

const findFirst = findFirstorLast("first");
const findLast = findFirstorLast("last");

Deno.test("findFirst", () => {
  assertEquals(findFirst("eightwothree"), "8");
  assertEquals(findFirst("4nineeightseven2"), "4");
  assertEquals(findLast("eightwothree"), "3");
  assertEquals(findLast("4nineeightseven2"), "2");
});

const parseLine2 = (input: string) => {
  const first = findFirst(input);
  const last = findLast(input);

  return Number(`${first}${last}`);
};

const parseLines = (input: string) => {
  return input.split("\n").map(parseLine).map((xs) => {
    const first = xs.at(0);
    const last = xs.at(-1);

    return Number(`${first}${last}`);
  });
};

const parseLines2 = (input: string) => {
  return input.split("\n").map(parseLine2);
};

Deno.test("parseLines", () => {
  assertEquals(parseLines(testInput), [12, 38, 15, 77]);
});

Deno.test("parseLines2", () => {
  assertEquals(
    parseLines2(`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`),
    [],
  );
});

const part1 = mod.sumOf(parseLines(dataString), (x) => x);
const part2 = mod.sumOf(parseLines2(dataString), (x) => x);

console.log(part2);
