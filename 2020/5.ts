import { data } from "./data/5.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { ObjectKeys } from "./types.d.ts";

const testData = {
  "BFFFBBFRRR": { row: 70, column: 7, id: 567 },
  "FFFBBBFRRR": { row: 14, column: 7, id: 119 },
  "BBFFBBFRLL": { row: 102, column: 4, id: 820 },
};

const doCalc = (
  zeroString: string,
  oneString: string,
  input: string,
): number => {
  const binaryString = input.replaceAll(zeroString, "0").replaceAll(
    oneString,
    "1",
  );
  return parseInt(binaryString, 2);
};

const getRow = (input: string) => {
  return doCalc("F", "B", input);
};

const getColumn = (input: string) => {
  return doCalc("L", "R", input);
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
