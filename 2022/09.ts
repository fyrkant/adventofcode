import { dataString } from "./data/09.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testString = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const parse = (input: string): [string, number][] => {
  return input.split("\n").map((l) => {
    const [d, s] = l.split(" ");

    return [d, parseInt(s)];
  });
};

Deno.test("parse", () => {
  assertEquals(parse(testString), [
    ["R", 4],
    ["U", 4],
    ["L", 3],
    ["D", 1],
    ["R", 4],
    ["D", 1],
    ["L", 5],
    ["R", 2],
  ]);
});

const difference = (a: number, b: number) => {
  return Math.abs(a - b);
};

const positionToString = ([x, y]: [number, number]) => {
  const r = `${String(x)},${String(y)}`;
  // console.log({ r });
  return r;
};

const findNewTailPosition = (
  [tailX, tailY]: [number, number],
  [headX, headY]: [number, number],
  prevHeadPos: [number, number],
): [number, number] => {
  if (difference(tailX, headX) > 1 || difference(tailY, headY) > 1) {
    return prevHeadPos;
  } else {
    return [tailX, tailY];
  }
};

const walk = (input: ReturnType<typeof parse>) => {
  let headPosition: [number, number] = [0, 0];
  let currentTailPosition: [number, number] = [0, 0];
  const tailPositions = new Set<string>([
    positionToString(currentTailPosition),
  ]);

  for (let index = 0; index < input.length; index++) {
    const [direction, steps] = input[index];
    const [headX, headY] = headPosition.slice();
    console.log(headPosition, currentTailPosition);
    if (direction === "U") {
      for (let x = headX + 1; x <= headX + steps; x++) {
        headPosition = [x, headY];

        // console.log({ headPosition });
        currentTailPosition = findNewTailPosition(
          currentTailPosition,
          headPosition,
          [x - 1, headY],
        );
        console.log({ currentTailPosition });
        tailPositions.add(positionToString(currentTailPosition));
      }
    } else if (direction === "R") {
      for (let y = headY + 1; y <= headY + steps; y++) {
        headPosition = [headX, y];
        console.log({ headPosition });
        currentTailPosition = findNewTailPosition(
          currentTailPosition,
          headPosition,
          [headX, y - 1],
        );
        console.log({ currentTailPosition });
        tailPositions.add(positionToString(currentTailPosition));
      }
    } else if (direction === "D") {
      for (let x = headX - 1; x >= headX - steps; x--) {
        headPosition = [x, headY];
        // console.log({ headPosition });
        currentTailPosition = findNewTailPosition(
          currentTailPosition,
          headPosition,
          [x + 1, headY],
        );

        console.log({ currentTailPosition });
        tailPositions.add(positionToString(currentTailPosition));
      }
    } else if (direction === "L") {
      for (let y = headY - 1; y >= headY - steps; y--) {
        console.log("L", y, headY);
        headPosition = [headX, y];
        // console.log({ headPosition });
        currentTailPosition = findNewTailPosition(
          currentTailPosition,
          headPosition,
          [headX, y + 1],
        );

        console.log({ currentTailPosition });
        tailPositions.add(positionToString(currentTailPosition));
      }
    }
  }

  console.log(Array.from(tailPositions.values()));

  return tailPositions.size;
};

Deno.test("walk", () => {
  assertEquals(walk(parse(testString)), 13);
  assertEquals(walk(parse(dataString)), 13);
});
