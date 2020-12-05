import { data } from "./data/5.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { ObjectKeys } from "./types.d.ts";

const testData = {
  "BFFFBBFRRR": { row: 70, column: 7, id: 567 },
  "FFFBBBFRRR": { row: 14, column: 7, id: 119 },
  "BBFFBBFRLL": { row: 102, column: 4, id: 820 },
};

const doCalc = (
  dir: "front" | "back",
  [s, e]: [number, number],
): [number, number] => {
  const delta = Math.round((s === 0 ? e : e % s) / 2);
  return dir === "front" ? [s, e - delta] : [s + delta, e];
};

assertEquals(doCalc("front", [0, 127]), [0, 63]);
assertEquals(doCalc("front", [64, 95]), [64, 79]);
assertEquals(doCalc("back", [0, 127]), [64, 127]);
assertEquals(doCalc("back", [0, 127]), [64, 127]);
assertEquals(doCalc("back", [0, 63]), [32, 63]);

const getStuff = (
  input: string,
  start: [number, number],
  frontString: string,
) => {
  return input.split("").reduce(([s, e], curr) => {
    const x = doCalc(curr === frontString ? "front" : "back", [s, e]);
    return x;
  }, start)[0];
};

const getRow = (input: string) => {
  return getStuff(input, [0, 127], "F");
};

const getColumn = (input: string) => {
  return getStuff(input, [0, 7], "L");
};

const getId = (input: string) => {
  const row = getRow(input.slice(0, 7));
  const column = getColumn(input.slice(7));
  return row * 8 + column;
};

// assertEquals(getRow("FBFBBFF"), 44);
assertEquals(getRow("BFFFBBF"), 70);
assertEquals(getColumn("RRR"), 7);
assertEquals(getColumn("RLL"), 4);

(Object.keys(testData) as ObjectKeys<typeof testData>).map((key) => {
  assertEquals(getRow(key.slice(0, 7)), testData[key].row);
  assertEquals(getColumn(key.slice(7)), testData[key].column);
  assertEquals(getId(key), testData[key].id);
});

const myId = data.split("\n").map((val) => {
  return getId(val);
}).sort((a, b) => a - b).reduce((prev, curr, index, arr) => {
  const next = arr[index + 1];
  const prospectiveNext = curr + 1;
  return index > 0 && typeof next !== "undefined" && prospectiveNext !== next
    ? prospectiveNext
    : prev;
}, undefined as number | undefined);

console.log(myId);
