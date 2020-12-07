import { data } from "./data/7.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { getUnique } from "./utils.ts";

const parseLine = (input: string): Record<string, Record<string, number>[]> => {
  const [c, r] = input.split("bags contain");
  const currentColor = c.trim();
  const rest = r.trim();
  const restNoDot = rest.slice(0, rest.length - 1);

  if (restNoDot === "no other bags") {
    return { [currentColor]: [] };
  } else {
    const x = restNoDot.split(", ").map((c) => {
      const [, count, x] = /^([0-9])+/.exec(c) || [];
      const color = c.slice(c.indexOf(count) + 1, c.length - 4).trim();

      return { [color]: parseInt(count, 10) };
    });
    return { [currentColor]: x };
  }
};

assertEquals(
  parseLine("light red bags contain 1 bright white bag, 2 muted yellow bags."),
  { "light red": [{ "bright white": 1 }, { "muted yellow": 2 }] },
);
assertEquals(
  parseLine("faded blue bags contain no other bags."),
  { "faded blue": [] },
);

const testData =
  `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;

const makeData = (input: string) =>
  input.split("\n").reduce((prev, line) => {
    const x = parseLine(line);

    return { ...prev, ...x };
  }, {} as Record<string, Record<string, number>[]>);

const searchColor = (
  input: string,
  data: Record<string, Record<string, number>[]>,
): string[] => {
  const xs = Object.keys(data).reduce((prev, key) => {
    const found = data[key].find((x) => typeof x[input] === "number");
    if (found) {
      const { [key]: r, ...restData } = data;
      return [...prev, key, ...searchColor(key, restData)];
    }
    return prev;
  }, [] as string[]);

  return getUnique(xs);
};

const countBags = (
  searchInput: string,
  data: Record<string, Record<string, number>[]>,
): number => {
  const { [searchInput]: f, ...restData } = data;

  return Array.isArray(f)
    ? f.reduce((p, c) => {
      return Object.keys(c).reduce((ip, key) => {
        const d = c[key];
        const z = countBags(key, restData);
        return p + c[key] * z;
      }, p);
    }, 1)
    : 0;
};

const testData2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;

assertEquals(countBags("shiny gold", makeData(testData2)) - 1, 126);

console.log(countBags("shiny gold", makeData(data)) - 1);
