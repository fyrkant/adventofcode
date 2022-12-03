import { dataString } from "./data/02.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";

const testData = `A Y
B X
C Z`;

const shapeMap = {
  A: "rock",
  B: "paper",
  C: "scissors",
  X: "rock",
  Y: "paper",
  Z: "scissors",
} as const;

const getShape = (x: string) => shapeMap[x as keyof typeof shapeMap];

const shapePointMap = {
  rock: 1,
  paper: 2,
  scissors: 3,
} as const;

const getShapePoint = (shape: string): number => {
  return shapePointMap[shape as keyof typeof shapePointMap] || 0;
};

const parseRounds = (input: string): [string, string][] => {
  const lines = input.split("\n");

  return lines.map((l) => {
    return l.split(" ").map((x) => x || "") as [string, string];
  });
};

Deno.test("parse", () => {
  assertEquals(parseRounds(testData), [["A", "Y"], ["B", "X"], [
    "C",
    "Z",
  ]]);
});

const getRoundResult = (enemyShape: string, yourShape: string): number => {
  if (enemyShape === yourShape) return 3;
  switch (yourShape) {
    case "rock": {
      return enemyShape === "scissors" ? 6 : 0;
    }
    case "paper": {
      return enemyShape === "rock" ? 6 : 0;
    }

    case "scissors": {
      return enemyShape === "paper" ? 6 : 0;
    }

    default: {
      return 0;
    }
  }
};

const getLoosingShapePoint = (
  wantedResult: string,
  enemyShape: string,
): string => {
  if (wantedResult === "draw") return enemyShape;
  switch (enemyShape) {
    case "rock": {
      return wantedResult === "win" ? "paper" : "scissors";
    }
    case "paper": {
      return wantedResult === "win" ? "scissors" : "rock";
    }

    case "scissors": {
      return wantedResult === "win" ? "rock" : "paper";
    }

    default:
      return "";
  }
};
const getRoundTwoWantedResult = (
  yourShape: string,
): "draw" | "win" | "lose" => {
  if (yourShape === "Y") return "draw";
  if (yourShape === "Z") return "win";

  return "lose";
};

const getScorePartOne = (rounds: [string, string][]) => {
  let score = 0;

  rounds.map((x) => x.map((y) => getShape(y))).forEach(
    ([enemyShape, yourShape]) => {
      const yourPoint = getShapePoint(yourShape);
      score += yourPoint + getRoundResult(enemyShape, yourShape);
    },
  );

  return score;
};

const getScorePartTwo = (rounds: [string, string][]) => {
  let score = 0;

  rounds.map(([x, y]) => {
    return [getShape(x), getRoundTwoWantedResult(y)];
  }).forEach(([enemyShape, wantedResult]) => {
    const resultPoint = wantedResult === "draw"
      ? 3
      : wantedResult === "win"
      ? 6
      : 0;
    const loosingShape = getLoosingShapePoint(wantedResult, enemyShape);

    score = score + resultPoint + getShapePoint(loosingShape);
  });

  return score;
};

Deno.test("part one", () => {
  assertEquals(getScorePartOne(parseRounds(testData)), 15);
  assertEquals(getScorePartOne(parseRounds(dataString)), 10994);
});
Deno.test("part two", () => {
  assertEquals(getScorePartTwo(parseRounds(testData)), 12);
  assertEquals(getScorePartTwo(parseRounds(dataString)), 12526);
});
