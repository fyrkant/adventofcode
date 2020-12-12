import { data } from "./data/6.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { unique } from "../utils.ts";

const getArrayOfObjects = (input: string): string[][] => {
  const splat = input.split("\n");

  const dividedStrings = splat.reduce((prev, curr) => {
    if (curr === "") {
      return [...prev, []];
    } else {
      const prevArr = prev[prev.length - 1] || [];
      const newNext = [...prevArr, curr.trim()].reduce((p, c) => {
        return [...p, c];
      }, [] as string[]);
      prev[Math.max(prev.length - 1, 0)] = newNext;

      return prev;
    }
  }, [] as string[][]);

  return dividedStrings;
};

const filterForAllHas = (x: string[][]) => {
  return x.map((v) => {
    return v.reduce((p, c) => {
      const splitCurr = c.split("");

      return unique([
        ...p,
        ...splitCurr.filter((x) => v.every((y) => y.includes(x))),
      ]);
    }, [] as string[]);
  });
};

assertEquals(
  filterForAllHas([["abc"], ["a", "b", "c"], ["ab", "ac"]]),
  [["a", "b", "c"], [], ["a"]],
);

const getCount = (input: string[][]) =>
  input.reduce((prev, curr) => {
    return prev + curr.length;
  }, 0 as number);

const testData = `abc

a
b
c

ab
ac

a
a
a
a

b`;

const arr = getArrayOfObjects(data);

console.log({
  count: getCount(filterForAllHas(arr)),
});
