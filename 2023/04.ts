import { dataString } from "./data/04.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

type ParsedLine = { cN: number; wN: number[]; yN: number[] };

const parseLine = (
  input: string,
): ParsedLine => {
  const [name, rest] = input.split(": ");
  const [, cardNumber] = name.split(" ");
  const [wS, yS] = rest.split(" | ");

  return {
    cN: Number(cardNumber),
    wN: wS.split(" ").filter((s) => s.trim() !== "").map((s) => Number(s)),
    yN: yS.split(" ").filter((s) => s.trim() !== "").map((s) => Number(s)),
  };
};

const getPoints = (winningNumberCount: number) => {
  if (winningNumberCount === 0) return 0;
  let points = 1;

  for (let index = 1; index < winningNumberCount; index++) {
    points = points * 2;
  }

  return points;
};

Deno.test("getPoints", () => {
  assertEquals(getPoints(4), 8);
});

const scoreCard = (card: ParsedLine) => {
  const wins = mod.intersect(card.wN, card.yN);
  console.log({ card, wins, points: getPoints(wins.length) });

  return getPoints(wins.length);
};

const partOne = (input: string) => {
  const lines = input.split("\n").map(parseLine).map(scoreCard);

  return mod.sumOf(lines, (x) => x);
};

Deno.test("wow", () => {
  assertEquals(partOne(testInput), 13);
  assertEquals(partOne(dataString), 26443);
});
