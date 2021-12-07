import { dataString } from './data/07';
import { strictEqual } from 'assert';

const testData = '16,1,2,0,4,2,7,1,2,14';

const handleData = (i: string): number[] =>
  i.split(',').map((x) => parseInt(x, 10));

const getIncreasing = (num: number) => {
  let sum = 0;
  for (let index = 1; index <= num; index++) {
    sum = sum + index;
  }

  return sum;
};

const findBestPosition = (input: number[]): number => {
  const sorted = input.slice().sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  const map = new Map<number, number>();

  for (let index = min; index <= max; index++) {
    const distances = sorted
      .map((n) => getIncreasing(Math.max(n, index) - Math.min(n, index)))
      .reduce((p, c) => p + c, 0);

    map.set(index, distances);
  }

  const x = Array.from(map.values()).sort((a, b) => a - b)[0];

  return x;
};

const td = handleData(testData);
const d = handleData(dataString);

console.log(findBestPosition(d));
