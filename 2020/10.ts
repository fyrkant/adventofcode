import { strictEqual } from 'assert';
import { data } from './data/10';
import { splitMap } from '../utils';

const parseLine = (input: string) => {
  return parseInt(input, 10);
};

const makeData = (input: string) => {
  return splitMap(input, parseLine);
};

const testData = `1
4
5
6
7
10
11
12
15
16
19`;

const getJolts = (input: number[], start = 0) => {
  const result = { one: 0, three: 0 };
  const sorted = input.sort((a, b) => a - b);
  const end = sorted[sorted.length - 1] + 3;
  const sortedWithEnd = [...sorted, end];

  let prev = start;
  for (const curr of sortedWithEnd) {
    const diff = curr - prev;

    if (diff === 1) {
      result.one += 1;
    } else if (diff === 3) {
      result.three += 1;
    } else if (diff > 3 || diff < 1) {
      return false;
    }
    prev = curr;
  }

  return result;
};

const testData2 = `1
2
3
4
7
8
9
10
11
14
17
18
19
20
23
24
25
28
31
32
33
34
35
38
39
42
45
46
47
48
49`;

const d1 = makeData(testData);
const d2 = makeData(testData2);
strictEqual(getJolts(d1), { one: 7, three: 5 });
strictEqual(getJolts(d2), { one: 22, three: 10 });
strictEqual(getJolts(makeData(data)), { one: 65, three: 38 });

const makeCorrectArr = (input: number[]) => {
  const sorted = input.sort((a, b) => a - b);
  return [0, ...sorted, sorted[sorted.length - 1] + 3];
};

const countArrangements = (
  arr: number[],
  startIndex: number,
  map: Map<number, number>
): number => {
  if (map.has(startIndex)) {
    return map.get(startIndex) as number;
  }
  let count = 0;

  for (let index = startIndex + 1; index < arr.length; index++) {
    if (arr[index] - arr[startIndex] < 4) {
      if (index === arr.length - 1) {
        count += 1;
      } else {
        count += countArrangements(arr, index, map);
      }
    }
  }

  map.set(startIndex, count);

  return count;
};
const getArrangementCount = (input: number[]): number => {
  const map = new Map<number, number>();
  const adapters = makeCorrectArr(input);

  return countArrangements(adapters, 0, map);
};

const s = getArrangementCount(d1);

console.log(s);
// const s2 = getArrangementCount(d2);

// console.log(s2);
// const s3 = getArrangementCount(makeData(data));

// console.log(s3);
