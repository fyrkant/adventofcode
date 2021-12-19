import { dataString } from './data/14.ts';

const testData = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

const handleData = (
  input: string
): {
  template: string;
  pairMap: Map<string, number>;
  rules: Map<string, string>;
} => {
  const [temp, rest] = input.split('\n\n');

  const map = new Map<string, string>();

  rest.split('\n').forEach((l) => {
    const [k, v] = l.split(' -> ');

    map.set(k, v);
  });

  const pairMap = new Map<string, number>();

  const splat = temp.split('');

  for (let index = 0; index < splat.length - 1; index++) {
    const a = splat[index];
    const b = splat[index + 1];

    const prev = pairMap.get(`${a}${b}`) || 0;
    pairMap.set(`${a}${b}`, prev + 1);
  }

  return { template: temp, pairMap, rules: map };
};

const increaseMap = (map: Map<string, number>, key: string, num: number) => {
  const prev = map.get(key) || 0;

  map.set(key, prev + num);
};

const partOne = (
  input: ReturnType<typeof handleData>,
  steps: number
): number => {
  let map = input.pairMap;
  for (let index = 0; index < steps; index++) {
    const newMap = new Map<string, number>();

    for (const [pair, val] of map.entries()) {
      const x = input.rules.get(pair);

      const [a, b] = pair.split('');
      increaseMap(newMap, `${a}${x}`, val);
      increaseMap(newMap, `${x}${b}`, val);
    }
    map = newMap;
  }
  const countMap = new Map<string, number>();
  increaseMap(countMap, input.template[0], 1);
  increaseMap(countMap, input.template[input.template.length - 1], 1);
  for (const [p, n] of map.entries()) {
    p.split('').forEach((c) => {
      increaseMap(countMap, c, n);
    });
  }

  const sorted = Array.from(countMap.entries()).sort((a, b) => b[1] - a[1]);
  return (sorted[0][1] - sorted[sorted.length - 1][1]) / 2;
};

const td = handleData(testData);
const d = handleData(dataString);

console.log(partOne(td, 10));
