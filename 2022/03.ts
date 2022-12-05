import { dataString } from "./data/03.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testString = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const splitBag = (bag: string): [string[], string[]] => {
  return [
    bag.slice(0, bag.length / 2).split(""),
    bag.slice(bag.length / 2).split(""),
  ];
};
const splitBags = (input: string) => {
  const bags = input.split("\n");

  return bags.map(splitBag);
};

Deno.test("splitBag", () => {
  assertEquals(splitBag("vJrwpWtwJgWrhcsFMMfFFhFp"), [
    "vJrwpWtwJgWr".split(""),
    "hcsFMMfFFhFp".split(""),
  ]);
});

const findCommon = ([one, two]: [string[], string[]]) => {
  return mod.intersect(one, two);
};

Deno.test("common", () => {
  assertEquals(findCommon(splitBag("vJrwpWtwJgWrhcsFMMfFFhFp")), ["p"]);
});

const getPoint = (character: string) => {
  const isUpperCase = character === character.toUpperCase();

  return character.toUpperCase().charCodeAt(0) - (isUpperCase ? 38 : 64);
};

Deno.test("getPoint", () => {
  assertEquals(getPoint("a"), 1);
  assertEquals(getPoint("A"), 27);
});

const partOne = (input: string) => {
  const commons = splitBags(input).flatMap(findCommon).map(getPoint);

  return mod.sumOf(commons, (x) => x);
};

Deno.test("partOne", () => {
  assertEquals(partOne(testString), 157);
  assertEquals(partOne(dataString), 7967);
});

const partTwo = (input: string) => {
  const bagGroups = input.split("\n").reduce<string[][]>((p, c) => {
    const last = p.at(-1);

    if (!last || last.length === 3) {
      const n = [c];
      p.push(n);
    } else {
      last.push(c);
    }

    return p;
  }, []);

  const commons = bagGroups.flatMap((group) => {
    return mod.intersect(...group.map((x) => x.split("")));
  }).map(getPoint);

  return mod.sumOf(commons, (x) => x);
};

Deno.test("partTwo", () => {
  assertEquals(partTwo(testString), 70);
  assertEquals(partTwo(dataString), 2716);
});
