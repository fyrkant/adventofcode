import { dataString } from "./data/04.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testString = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const createArray = (input: string): number[] => {
  const [start, end] = input.split("-").map((x) => parseInt(x, 10));

  const l = end - start + 1;

  return Array.from({ length: l }, (_, i) => start + i);
};

Deno.test("arr", () => {
  assertEquals(createArray("1-3"), [1, 2, 3]);
  assertEquals(createArray("6-6"), [6]);
  assertEquals(createArray("2-8"), [2, 3, 4, 5, 6, 7, 8]);
});

const partOne = (input: string) => {
  const lines = input.split("\n");

  const x = lines.map((l) => l.split(",").map(createArray)).filter(([l, r]) => {
    const inter = mod.intersect(l, r);

    return inter.length === l.length || inter.length === r.length;
  });

  return x.length;
};

const partTwo = (input: string) => {
  const lines = input.split("\n");

  const x = lines.map((l) => l.split(",").map(createArray)).filter(([l, r]) => {
    const inter = mod.intersect(l, r);

    return inter.length > 0;
  });

  return x.length;
};

Deno.test("part one", () => {
  assertEquals(partOne(testString), 2);
  assertEquals(partOne(dataString), 475);
});
Deno.test("part two", () => {
  assertEquals(partTwo(testString), 4);
  assertEquals(partTwo(dataString), 475);
});
