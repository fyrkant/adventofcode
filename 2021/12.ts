import { dataString } from './data/12.ts';
import { assertEquals } from 'https://deno.land/std@0.117.0/testing/asserts.ts';

const testData = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const testData2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

const testData3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

const handleData = (input: string): Map<string, string[]> => {
  const map = new Map<string, string[]>();

  input.split('\n').forEach((line) => {
    const [start, end] = line.split('-');
    console.log(start, end);

    const startPrev = map.get(start) || [];

    map.set(start, [...startPrev, end.trim()]);

    // if (end === 'start') {
    //   throw new Error('fack');
    // }

    const endPrev = map.get(end) || [];
    map.set(
      end,
      [...endPrev, start.trim()].filter((x) => x !== 'start')
    );
  });

  return map;
};

const checkIsSmall = (x: string) => x.toLowerCase() === x;

assertEquals(checkIsSmall('x'), true);
assertEquals(checkIsSmall('X'), false);

const partOne = (list: ReturnType<typeof handleData>): number => {
  let numberOfWays = 0;

  console.log(list);

  const dfs = (start: string, visited = new Set()) => {
    const vis = new Set(visited);
    vis.add(start);

    const destinations = list.get(start) || [];

    for (const destination of destinations) {
      if (destination === 'end') {
        console.log([...Array.from(vis.values())].join('->'));
        numberOfWays++;
      }

      if (!checkIsSmall(destination) || !vis.has(destination)) {
        dfs(destination, vis);
      }
    }
  };

  // const start = input.get('start') || [];
  dfs('start');
  return numberOfWays;
};

const partTwo = (list: ReturnType<typeof handleData>): number => {
  let numberOfWays = 0;

  console.log(list);

  const dfs = (start: string, visited = new Set<string>(), twiced = false) => {
    const vis = new Set<string>(visited);
    // if (start !== 'start') {
    vis.add(start);
    // }

    if (start === 'end') {
      console.log([...Array.from(vis.values())].join(','));
      numberOfWays++;
      return;
    }

    const destinations = list.get(start) || [];

    for (const destination of destinations) {
      if (!checkIsSmall(destination)) {
        dfs(destination, vis, twiced);
      } else if (!vis.has(destination)) {
        dfs(destination, vis, twiced);
      } else if (!twiced && destination !== 'start') {
        dfs(destination, vis, true);
      }
    }
  };

  dfs('start');
  return numberOfWays;
};

console.log(partTwo(handleData(testData)));
console.log(partTwo(handleData(testData2)));
console.log(partTwo(handleData(testData3)));
console.log(partTwo(handleData(dataString)));
