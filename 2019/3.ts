import { data } from "./data/3.ts";
import { strictEqual } from "assert";
import { splitMap } from "../utils.ts";

const parseLine = (input: string): [string, number][] => {
  return input.split(",").map((e) => {
    const [direction, ...num] = e;
    return [direction, parseInt(num.join(""), 10)];
  });
};

const testData = `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`;

const getCrossedPoints = (input: [string, number][][]) => {
  const grid: string[][] = [];
  for (let line = 0; line < input.length; line++) {
    const arr = input[line];

    for (let index = 0; index < arr.length; index++) {
      const [direction, number] = arr[index];
      for (let i = 0; i < number; i++) {
        if (direction === "R") {
          const p = grid[index][i];

          grid[index][i] = p ? "X" : "-";
        } else if (direction === 'L')
      }
    }
  }
  return grid;
};

console.log(getCrossedPoints(testData.split("\n").map(parseLine)));
