import { dataString } from "./data/03.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testData = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

const hello = (input: string) => {
  const lines = input.split("\n");

  const nums: string[] = [];

  lines.forEach((line, index) => {
    const ns = Array.from(line.matchAll(/([\d])\w*/g));

    ns.forEach((regexMatch) => {
      const [n] = regexMatch;
      const ni = regexMatch.index || 0;

      const before = line[ni - 1] || "";
      const after = line[ni + n.length] || "";

      const toCompare = [
        Math.max(0, ni - 1),
        Math.min(line.length + 1, ni + n.length + 1),
      ];

      const aboveLine = lines[index - 1];
      const belowLine = lines[index + 1];

      const adjacentAbove = aboveLine?.slice(toCompare[0], toCompare[1]) || "";
      const adjacentBelow = belowLine?.slice(toCompare[0], toCompare[1]) || "";

      const surrounds = adjacentAbove + before + after + adjacentBelow;

      console.log(`
-----------

NUM: ${n}
PART: ${surrounds.split("").some((x) => x !== ".") ? "YES" : "NO"}

${adjacentAbove}
${before}${n}${after}
${adjacentBelow}

-----------`);

      if (
        surrounds.split("").some((x) =>
          x !== "." && !"0123456789".split("").includes(x)
        )
      ) {
        nums.push(n);
      }
    });

    console.log(line);
  });
  console.log(nums);
  return mod.sumOf(nums, (n) => Number(n));
};

Deno.test("howdy", () => {
  // assertEquals(
  //   hello(testData),
  //   4361,
  // );

  assertEquals(
    hello(`........
.24..4..
......*.`),
    4,
  );

  assertEquals(hello(dataString), 45);
});
