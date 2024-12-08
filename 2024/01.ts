import { dataString } from "./data/01.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testString = `3   4
4   3
2   5
1   3
3   9
3   3`;

const parseToArrays = (input: string): [number[], number[]] => {
  const arr1: number[] = [];
  const arr2: number[] = [];

  input.split("\n").forEach((line) => {
    const [l, r] = line.split("   ");

    arr1.push(parseInt(l));
    arr2.push(parseInt(r));
  });

  return [arr1, arr2];
};

const solve1 = (input: string) => {
  const [l, r] = parseToArrays(input);

  const sortedL = l.toSorted();
  const sortedR = r.toSorted();

  let result = 0;

  sortedL.forEach((v, i) => {
    const correspondingR = sortedR[i];

    result = result + Math.abs(v - correspondingR);
  });

  return result;
};

console.log(solve1(testString));
console.log(solve1(dataString));

const solve2 = (input: string) => {
  const [l, r] = parseToArrays(input);

  const sortedL = l.toSorted();
  const sortedR = r.toSorted();

  let result = 0;

  sortedL.forEach((v) => {
    const fi = sortedR.indexOf(v);
    if (fi >= 0) {
      const li = sortedR.lastIndexOf(v);
      console.log(fi, li);
      const count = (li - fi) + 1;

      result = result + (v * count);
    }
  });

  return result;
};

console.log(solve2(testString));
console.log(solve2(dataString));
