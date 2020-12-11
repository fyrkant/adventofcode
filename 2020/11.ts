import { data } from "./data/11.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { splitMap } from "../utils.ts";

const floor = ".";
const emptySeat = "L";
const occupiedSeat = "#";

const testData = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

const testData2 = `#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##`;

const testData3 = `#.LL.L#.##
#LLLLLL.L#
L.L.L..L..
#LLL.LL.L#
#.LL.LL.LL
#.LLLL#.##
..L.L.....
#LLLLLLLL#
#.LLLLLL.L
#.#LLLL.##`;

const testData4 = `#.##.L#.##
#L###LL.L#
L.#.#..#..
#L##.##.L#
#.##.LL.LL
#.###L#.##
..#.#.....
#L######L#
#.LL###L.L
#.#L###.##`;

const testData5 = `#.#L.L#.##
#LLL#LL.L#
L.L.L..#..
#LLL.##.L#
#.LL.LL.LL
#.LL#L#.##
..L.L.....
#L#LLLL#L#
#.LLLLLL.L
#.#L#L#.##`;

const testData6 = `#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##`;

const parseLine = (input: string) => {
  return splitMap(input, (x) => x, "");
};

const makeData = (input: string) => {
  return splitMap(input, parseLine);
};

const getFromDelta = (
  arr: string[][],
  [newLineIndex, newSeatIndex]: [number, number],
): string | false => {
  const newLine = arr[newLineIndex];
  if (!newLine) return false;
  const newSeat = newLine[newSeatIndex];
  if (!newSeat) return false;

  return newSeat;
};

const countSurroundingSeats = (
  arr: string[][],
  lineIndex: number,
  seatIndex: number,
) => {
  const deltas = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return deltas.reduce((p, [newLineIndex, newSeatIndex]) => {
    const newSeat = getFromDelta(
      arr,
      [lineIndex + newLineIndex, seatIndex + newSeatIndex],
    );
    if (!newSeat) return p;

    return newSeat === occupiedSeat ? p + 1 : p;
  }, 0 as number);
};

assertEquals(countSurroundingSeats(makeData(testData), 0, 0), 0);
assertEquals(countSurroundingSeats(makeData(testData2), 0, 0), 2);
assertEquals(countSurroundingSeats(makeData(testData2), 1, 2), 5);
assertEquals(countSurroundingSeats(makeData(testData2), 4, 9), 5);

const countSeenSurrounding = (
  arr: string[][],
  lineIndex: number,
  seatIndex: number,
) => {
  const deltas = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return deltas.reduce((p, [newLineIndex, newSeatIndex], currentIndex) => {
    let newPos = [newLineIndex, newSeatIndex];
    const [one, two] = [lineIndex + newPos[0], seatIndex + newPos[1]];
    let newSeat = getFromDelta(arr, [one, two]);

    while (newSeat && newSeat === floor) {
      newPos = [newPos[0] + newLineIndex, newPos[1] + newSeatIndex];
      const [x, y] = [lineIndex + newPos[0], seatIndex + newPos[1]];
      newSeat = getFromDelta(arr, [x, y]);
    }

    return newSeat === occupiedSeat ? p + 1 : p;
  }, 0 as number);
};

assertEquals(
  countSeenSurrounding(
    makeData(`.............
.L.L.#.#.#.#.
.............`),
    1,
    1,
  ),
  0,
);
assertEquals(
  countSeenSurrounding(
    makeData(`.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....`),
    4,
    3,
  ),
  8,
);

const applySeatingRules = (input: string[][]) => {
  const result = input.map((x) => x.slice()).slice();
  for (let lineIndex = 0; lineIndex < result.length; lineIndex++) {
    const line = input[lineIndex];
    for (let seatIndex = 0; seatIndex < line.length; seatIndex++) {
      const seat = line[seatIndex];
      const occupiedCount = countSeenSurrounding(
        input,
        lineIndex,
        seatIndex,
      );
      if (
        seat === emptySeat &&
        occupiedCount === 0
      ) {
        result[lineIndex][seatIndex] = occupiedSeat;
      } else if (
        seat === occupiedSeat &&
        occupiedCount >= 5
      ) {
        result[lineIndex][seatIndex] = emptySeat;
      } else {
        result[lineIndex][seatIndex] = seat;
      }
    }
  }
  return result;
};

// assertEquals(applySeatingRules(makeData(testData)), makeData(testData2));
// assertEquals(applySeatingRules(makeData(testData2)), makeData(testData3));
// assertEquals(applySeatingRules(makeData(testData3)), makeData(testData4));
// assertEquals(applySeatingRules(makeData(testData4)), makeData(testData5));
// assertEquals(applySeatingRules(makeData(testData5)), makeData(testData6));
// assertEquals(applySeatingRules(makeData(testData6)), makeData(testData6));
// // assertEquals(
//   applySeatingRules(makeData(testData3)),
//   makeData(testData4),
//   "third",
// );

const arrayEquals = (a1: string[][], a2: string[][]) => {
  for (let lineIndex = 0; lineIndex < a1.length; lineIndex++) {
    const lineArr = a1[lineIndex];
    for (let itemIndex = 0; itemIndex < lineArr.length; itemIndex++) {
      const element = lineArr[itemIndex];

      if (element !== a2[lineIndex][itemIndex]) {
        return false;
      }
    }
  }
  return true;
};

const runUntilSameReturn = (input: string[][]) => {
  let prev: string[][] | null = null;

  let result = applySeatingRules(input);
  while (true) {
    if (Array.isArray(prev) && arrayEquals(result, prev)) {
      return result;
    }
    prev = result;
    result = applySeatingRules(result);
  }
};

const countOccupiedSeats = (input: string[][]): number => {
  return input.reduce((lineCount, line) => {
    return lineCount + line.reduce((seatCount, seat) => {
      return seatCount + (seat === occupiedSeat ? 1 : 0);
    }, 0);
  }, 0);
};

// assertEquals(countOccupiedSeats(makeData(testData6)), 37);

// assertEquals(countOccupiedSeats(runUntilSameReturn(makeData(testData))), 37);
assertEquals(countOccupiedSeats(runUntilSameReturn(makeData(data))), 2234);
