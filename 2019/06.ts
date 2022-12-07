import { dataString } from "./data/06.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const testString = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;

const parseToPairs = (input: string): [string, string][] => {
  const lines = input.split("\n");

  return lines.map((l) => {
    const [left, right] = l.split(")");

    return [left, right];
  });
};

const partOne = (input: [string, string][]) => {
  const d: Record<string, string[]> = {};

  const getParent = (k: string): string[] => {
    const x = d[k] || [];

    // console.log({ k, x });

    return x;
  };

  input.forEach(([l, r]) => {
    d[String(r)] = [l, ...getParent(l)];
    // console.log(d);
  });

  console.log(d);

  return Object.values(d).flat().length;
};

Deno.test("part one", () => {
  assertEquals(partOne(parseToPairs(testString)), 42);
  assertEquals(partOne(parseToPairs(dataString)), 3100);
});
