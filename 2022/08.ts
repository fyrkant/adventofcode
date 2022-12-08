import { dataString } from "./data/08.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";

const testString = `30373
25512
65332
33549
35390`;

const makeGrid = (input: string) => {
  return input.split("\n").map((l) => l.split("").map((s) => parseInt(s, 10)));
};

console.log(makeGrid(testString));

const makeRange = (start: number, end: number) => {
  const r = [];

  const growing = start < end;

  for (
    let index = start;
    growing ? index <= end : index >= end;
    start < end ? index++ : index--
  ) {
    r.push(index);
  }
  return r;
};

Deno.test("makeRange", () => {
  assertEquals(makeRange(0, 5), [0, 1, 2, 3, 4, 5]);
  assertEquals(makeRange(5, 0), [5, 4, 3, 2, 1, 0]);
});

const allSmaller = (current: number, xs: number[]) =>
  xs.every((x) => x < current);

const partOne = (grid: number[][]) => {
  const visibleTrees = [];

  for (let xPos = 0; xPos < grid.length; xPos++) {
    const line = grid[xPos];

    for (let yPos = 0; yPos < line.length; yPos++) {
      const current = line[yPos];

      // trees on the edge are always seen
      if (
        yPos === 0 || xPos === 0 || yPos === grid.length - 1 ||
        xPos === line.length - 1
      ) {
        visibleTrees.push(current);
      } else {
        const topTrees = makeRange(xPos - 1, 0).map((x) => grid[x][yPos]);
        const rightTrees = makeRange(yPos + 1, line.length - 1).map((y) =>
          grid[xPos][y]
        );
        const bottomTrees = makeRange(xPos + 1, grid.length - 1).map((x) =>
          grid[x][yPos]
        );
        const leftTrees = makeRange(yPos - 1, 0).map((y) => grid[xPos][y]);

        console.log({ current, topTrees, rightTrees, bottomTrees, leftTrees });

        if (
          [topTrees, rightTrees, bottomTrees, leftTrees].map((xs) =>
            allSmaller(current, xs)
          ).some(Boolean)
        ) {
          visibleTrees.push(current);
        }
      }
    }
  }

  return visibleTrees.length;
};

Deno.test("part one", () => {
  assertEquals(
    partOne(makeGrid(testString)),
    21,
  );
  assertEquals(partOne(makeGrid(dataString)), 2);
});

const countUntilSameOrHigher = (x: number, xs: number[]) => {
  let count = 0;
  for (let index = 0; index < xs.length; index++) {
    const y = xs[index];

    if (y < x) {
      count++;
    } else if (y >= x) {
      count++;
      return count;
    }
  }
  return count;
};

const partTwo = (grid: number[][]) => {
  let scenicScore = 0;

  for (let xPos = 0; xPos < grid.length; xPos++) {
    const line = grid[xPos];

    for (let yPos = 0; yPos < line.length; yPos++) {
      const current = line[yPos];

      if (
        yPos === 0 || xPos === 0 || yPos === grid.length - 1 ||
        xPos === line.length - 1
      ) {
        continue;
      }
      console.log({ xPos, yPos });
      const topScore = countUntilSameOrHigher(
        current,
        makeRange(xPos - 1, 0).map((x) => grid[x][yPos]),
      );
      const rightScore = countUntilSameOrHigher(
        current,
        makeRange(yPos + 1, line.length - 1).map((y) => grid[xPos][y]),
      );
      const bottomScore = countUntilSameOrHigher(
        current,
        makeRange(xPos + 1, grid.length - 1).map((x) => grid[x][yPos]),
      );
      const leftScore = countUntilSameOrHigher(
        current,
        makeRange(yPos - 1, 0).map((y) => grid[xPos][y]),
      );

      const currentScenicScore = topScore * rightScore * bottomScore *
        leftScore;

      if (currentScenicScore > scenicScore) {
        scenicScore = currentScenicScore;
      }
    }
  }

  return scenicScore;
};

Deno.test("part two", () => {
  assertEquals(partTwo(makeGrid(testString)), 8);
  assertEquals(partTwo(makeGrid(dataString)), 8);
});
