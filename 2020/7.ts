import { strictEqual } from 'assert';
import { data } from './data/7';

const getSplitLine = (input: string): [string, string] => {
  const [start, end] = input.split('bags contain');
  const color = start.trim();
  const trimmedEnd = end.trim();
  const rest = trimmedEnd.slice(0, trimmedEnd.length - 1);

  return [color, rest];
};

const getBagMap = (input: string): Map<string, number> => {
  if (input === 'no other bags') {
    return new Map<string, number>();
  }
  const map = new Map<string, number>();

  for (const c of input.split(', ')) {
    const [, count] = /^([0-9])+/.exec(c) || [];
    const color = c.slice(c.indexOf(count) + 1, c.length - 4).trim();

    map.set(color, parseInt(count, 10));
  }

  return map;
};

const parseLine = (input: string): [string, Map<string, number>] => {
  const [color, rest] = getSplitLine(input);

  return [color, getBagMap(rest)];
};

strictEqual(
  parseLine('light red bags contain 1 bright white bag, 2 muted yellow bags.'),
  [
    'light red',
    new Map([
      ['bright white', 1],
      ['muted yellow', 2],
    ]),
  ]
);
strictEqual(parseLine('faded blue bags contain no other bags.'), [
  'faded blue',
  new Map(),
]);

const makeDataMap = (input: string): Map<string, Map<string, number>> => {
  const map = new Map<string, Map<string, number>>();
  for (const line of input.split('\n')) {
    map.set(...parseLine(line));
  }

  return map;
};

const searchColor = (
  input: string,
  dataMap: Map<string, Map<string, number>>
): Set<string> => {
  const set = new Set<string>();

  dataMap.delete(input);
  for (const key of dataMap.keys()) {
    const found = typeof dataMap.get(key)?.get(input) === 'number';
    if (found) {
      [key, ...searchColor(key, dataMap).values()].forEach(set.add, set);
    }
  }
  return set;
};

const testData = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;

strictEqual(searchColor('shiny gold', makeDataMap(testData)).size, 4);
strictEqual(searchColor('shiny gold', makeDataMap(data)).size, 126);

const countBags = (
  searchInput: string,
  dataMap: Map<string, Map<string, number>>
): number => {
  const val = dataMap.get(searchInput);
  let sum = 0;

  if (val) {
    for (const [k, v] of val.entries()) {
      sum += v * (1 + countBags(k, dataMap));
    }
  }

  return sum;
};

const testData2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;

strictEqual(countBags('shiny gold', makeDataMap(testData2)), 126);

console.log(countBags('shiny gold', makeDataMap(data)));
