import { dataString } from './data/01';
import { strictEqual } from 'assert';

const findIncreases = (nums: number[]): number => {
  let increases = 0;
  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];
    const previousElement = nums[index - 1];

    if (previousElement && element > previousElement) {
      increases = increases + 1;
    }
  }
  return increases;
};
const findIncreasedThirds = (nums: number[]): number => {
  let increases = 0;
  let prev = null;
  for (let index = 0; index < nums.length; index++) {
    const [a, b, c] = nums.slice(index - 2);

    if (a && b && c) {
      const s = a + b + c;
      if (prev && prev < s) {
        increases = increases + 1;
      }
      prev = s;
    }
  }
  return increases;
};

const mapToNums = (s: string): number[] => {
  return s.split('\n').map((x) => parseInt(x, 10));
};

strictEqual(
  findIncreases(
    mapToNums(`199
200
208
210
200
207
240
269
260
263`)
  ),
  7
);
strictEqual(
  findIncreasedThirds(
    mapToNums(`199
200
208
210
200
207
240
269
260
263`)
  ),
  5
);

strictEqual(findIncreases(mapToNums(dataString)), 1791);
strictEqual(findIncreasedThirds(mapToNums(dataString)), 1822);
