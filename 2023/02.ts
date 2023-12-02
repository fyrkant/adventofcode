import { dataString } from "./data/02.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";
import { sumOf } from "https://deno.land/std@0.166.0/collections/sum_of.ts";

const testData = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const parseLine = (input: string) => {
  const [game, setsString] = input.split(": ");
  const [, gameNum] = game.split(" ");

  const sets = setsString.split("; ").map((setString) =>
    setString.split(", ").map((set) => {
      const [n, c] = set.split(" ");

      return { color: c as "red" | "green" | "blue", num: Number(n) };
    })
  );

  return { gameNum: Number(gameNum), sets };
};

Deno.test("parseLine", () => {
  assertEquals(
    parseLine(
      "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    ),
    { gameNum: 3, sets: [] },
  );
});

type MaxDefinition = { red: number; green: number; blue: number };

const checkMaxDefinition = (
  game: ReturnType<typeof parseLine>,
  max: MaxDefinition,
) => {
  return game.sets.flat().every(({ color, num }) => {
    return (color === "red" && num <= max.red) ||
      (color === "green" && num <= max.green) ||
      (color === "blue" && num <= max.blue);
  });
};

Deno.test("checkMaxDefinition", () => {
  assertEquals(
    checkMaxDefinition(
      parseLine(
        "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
      ),
      { red: 12, green: 13, blue: 14 },
    ),
    false,
  );
});

const partOne = (
  input: string,
  max: MaxDefinition,
) => {
  const parsedGames = input.split("\n").map(parseLine).filter((game) => {
    return checkMaxDefinition(game, max);
  });

  const sum = mod.sumOf(parsedGames, (g) => g.gameNum);

  console.log(sum);
};

const getBiggestColorNums = (game: ReturnType<typeof parseLine>) => {
  const max = { red: 0, green: 0, blue: 0 };

  game.sets.flat().forEach((set) => {
    if (set.num > max[set.color]) {
      max[set.color] = set.num;
    }
  });

  return max;
};

const partTwo = (input: string) => {
  const parsedGames = input.split("\n").map(parseLine).map((game) => {
    const max = getBiggestColorNums(game);

    return Object.values(max).reduce((p, c) => p * c, 1);
  });

  return sumOf(parsedGames, (x) => x);
};

// console.log(partOne(testData, { red: 12, green: 13, blue: 14 }));
// console.log(partOne(dataString, { red: 12, green: 13, blue: 14 }));
console.log(partTwo(testData));
console.log(partTwo(dataString));
