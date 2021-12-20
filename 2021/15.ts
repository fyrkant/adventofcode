import { dataString } from './data/15.ts';
import dij from 'https://deno.land/x/dijkstra/mod.ts';
// import { strictEqual } from 'assert';

const testData = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

const makeGraph = (
  input: string
): [Record<string, Record<string, number>>, number[][]] => {
  const arr = input
    .split('\n')
    .map((line) => line.split('').map((c) => parseInt(c, 10)));
  const xs: number[][] = [];
  for (let step = 0; step < 5; step++) {
    for (let i = 0; i < arr.length; i++) {
      const oldLine = arr[i].map((v) => {
        if (step === 0) {
          return v;
        }
        const x = v + step > 9 ? (v + step) % 9 : v + step;
        return x === 0 ? 1 : x;
      });
      const newLine: number[] = [];
      for (let is = 0; is < 5; is++) {
        oldLine.forEach((e) => {
          if (is === 0) {
            newLine.push(e);
          } else {
            const x = e + is > 9 ? (e + is) % 9 : e + is;

            newLine.push(x === 0 ? 1 : x);
          }
        });
      }
      xs.push(newLine);
    }
  }
  const record: Record<string, Record<string, number>> = {};
  // const map = new Map<string, Record<string, number>>();
  for (let i = 0; i < xs.length; i++) {
    const line = xs[i];
    for (let j = 0; j < line.length; j++) {
      const [u, r, d, l] = [
        (xs[i - 1] || [])[j],
        line[j + 1],
        (xs[i + 1] || [])[j],
        line[j - 1],
      ];
      const neighbors: Record<string, number>[] = [];

      const getName = (one: number, two: number) => {
        return one === 0 && two === 0
          ? 'start'
          : one === xs.length - 1 && two === line.length - 1
          ? 'end'
          : `${one},${two}`;
      };

      if (typeof u === 'number') {
        neighbors.push({ [getName(i - 1, j)]: u });
      }
      if (typeof r === 'number') {
        neighbors.push({ [getName(i, j + 1)]: r });
      }
      if (typeof d === 'number') {
        neighbors.push({ [getName(i + 1, j)]: d });
      }
      if (typeof l === 'number') {
        neighbors.push({ [getName(i, j - 1)]: l });
      }

      // map.set(
      //   getName(i, j),
      //   neighbors.reduce((p, e) => {
      //     return { ...p, ...e };
      //   }, {} as Record<string, number>)
      // );
      record[getName(i, j)] = neighbors.reduce((p, e) => {
        return { ...p, ...e };
      }, {} as Record<string, number>);
    }
  }
  return [record, xs];
};

const lowestCostNode = (costs: Map<string, number>, processed: Set<string>) => {
  return Array.from(costs.keys()).reduce((lowest: null | string, node) => {
    if (
      lowest === null ||
      (costs.get(node) as number) < (costs.get(lowest) as number)
    ) {
      if (!processed.has(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

const dijkstra = (graph: Map<string, Record<string, number>>) => {
  // track lowest cost to reach each node
  const start = graph.get('start');
  const costMap = new Map<string, number>();
  costMap.set('end', Infinity);
  for (const key in start) {
    costMap.set(key, start[key]);
  }
  // const costs = Object.assign({ end: Infinity }, start);
  // track paths
  // const parents = new Map<string, string | null>();
  // parents.set('end', null);
  // for (const child in start) {
  //   parents.set(child, 'start');
  // }

  // track nodes that have already been processed
  const processed = new Set<string>();

  let node = lowestCostNode(costMap, processed);

  while (node) {
    const cost = costMap.get(node) || 0;
    // console.log(node, cost);
    const children = graph.get(node);
    for (const n in children) {
      if (n !== 'start') {
        const newCost = cost + children[n];
        const nCost = costMap.get(n);
        if (!nCost) {
          costMap.set(n, newCost);
          // parents.set(n, node);
        } else if ((nCost as number) > newCost) {
          costMap.set(n, newCost);
          // parents.set(n, node);
        }
      }
    }
    processed.add(node);
    node = lowestCostNode(costMap, processed);
  }

  // const optimalPath = ['end'];
  // let parent = parents.end;
  // while (parent) {
  //   optimalPath.push(parent);
  //   parent = parents[parent];
  // }
  // optimalPath.reverse();

  const results = {
    distance: costMap.get('end'),
    // path: optimalPath,
  };

  return results;
};

console.time('make data');
const [td, arr] = makeGraph(dataString);
// const d = makeGraph(dataString);
console.timeEnd('make data');
// console.log('made data!');
// console.log(td);
console.time('find path');
console.log(
  dij.find_path(td, 'start', 'end').reduce((p, e) => {
    if (e === 'start') {
      return p;
    } else if (e === 'end') {
      return p + arr[arr.length - 1][arr.length - 1];
    }
    const [x, y] = e.split(',').map((s) => parseInt(s, 10));
    return p + arr[x][y];
  }, 0)
);
// console.log(dijkstra(d));
console.timeEnd('find path');
