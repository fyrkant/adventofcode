import { dataString } from './data/09.ts';
import { assertEquals } from 'https://deno.land/std@0.117.0/testing/asserts.ts';

import { sumOf } from 'https://deno.land/std@0.117.0/collections/mod.ts';

const testData = `2199943210
3987894921
9856789892
8767896789
9899965678`;

const handleData = (s: string): number[][] => {
  return s.split('\n').map((x) => x.split('').map((y) => parseInt(y, 10)));
};

const findLowPoints = (input: ReturnType<typeof handleData>): number => {
  const nums: number[] = [];

  for (let index = 0; index < input.length; index++) {
    const line = input[index];

    for (let ii = 0; ii < line.length; ii++) {
      const element = line[ii];
      const topElement = (input[index - 1] || [])[ii];
      const leftElement = line[ii - 1];
      const rightElement = line[ii + 1];
      const bottomElement = (input[index + 1] || [])[ii];

      if (
        [topElement, leftElement, rightElement, bottomElement].every((n) => {
          return typeof n !== 'number' || element < n;
        })
      ) {
        nums.push(element);
      }
    }
  }

  console.log(nums);

  return nums.reduce((p, e) => p + (e + 1), 0);
};

const findLowPointPositions = (
  input: ReturnType<typeof handleData>
): [x: number, y: number][] => {
  const positions: [x: number, y: number][] = [];

  for (let index = 0; index < input.length; index++) {
    const line = input[index];

    for (let ii = 0; ii < line.length; ii++) {
      const element = line[ii];
      const topElement = (input[index - 1] || [])[ii];
      const leftElement = line[ii - 1];
      const rightElement = line[ii + 1];
      const bottomElement = (input[index + 1] || [])[ii];

      if (
        [topElement, leftElement, rightElement, bottomElement].every((n) => {
          return typeof n !== 'number' || element < n;
        })
      ) {
        positions.push([index, ii]);
      }
    }
  }

  return positions;
};

const findSurroundingBiggerNumberPositions = (
  input: ReturnType<typeof handleData>,
  x: number,
  y: number,
  origin?: 'top' | 'left' | 'right' | 'bottom'
): [x: number, y: number][] => {
  const positions: [x: number, y: number][] = [];

  const line = input[x];
  const element = input[x][y];
  const topElement = (input[x - 1] || [])[y];
  const leftElement = line[y - 1];
  const rightElement = line[y + 1];
  const bottomElement = (input[x + 1] || [])[y];

  // console.log({
  //   origin,
  //   x,
  //   y,
  //   element,
  //   topElement,
  //   leftElement,
  //   rightElement,
  //   bottomElement,
  // });

  if (
    origin !== 'top' &&
    typeof topElement === 'number' &&
    topElement > element &&
    topElement !== 9
  ) {
    // console.log('top');
    positions.push([x - 1, y]);

    const surrounding = findSurroundingBiggerNumberPositions(
      input,
      x - 1,
      y,
      'bottom'
    );

    positions.push(...surrounding);
  }
  if (
    origin !== 'left' &&
    typeof leftElement === 'number' &&
    leftElement > element &&
    leftElement !== 9
  ) {
    // console.log('left');
    positions.push([x, y - 1]);

    const surrounding = findSurroundingBiggerNumberPositions(
      input,
      x,
      y - 1,
      'right'
    );

    positions.push(...surrounding);
  }
  if (
    origin !== 'right' &&
    typeof rightElement === 'number' &&
    rightElement > element &&
    rightElement !== 9
  ) {
    // console.log('right');
    positions.push([x, y + 1]);

    const leftSurrounding = findSurroundingBiggerNumberPositions(
      input,
      x,
      y + 1,
      'left'
    );

    positions.push(...leftSurrounding);
  }
  if (
    origin !== 'bottom' &&
    typeof bottomElement === 'number' &&
    bottomElement > element &&
    bottomElement !== 9
  ) {
    // console.log('bottom');
    positions.push([x + 1, y]);

    const surrounding = findSurroundingBiggerNumberPositions(
      input,
      x + 1,
      y,
      'top'
    );

    positions.push(...surrounding);
  }

  if (!origin) {
    positions.push([x, y]);
  }

  return positions;
};

const partTwo = (input: ReturnType<typeof handleData>): number => {
  const lowPointPositions = findLowPointPositions(input);

  console.log(lowPointPositions);

  const basins: number[] = lowPointPositions.map(([x, y]) => {
    const surrounding = findSurroundingBiggerNumberPositions(input, x, y);

    const xs = [[x, y], ...surrounding];
    const stringed = [...new Set(xs.map(([x, y]) => `${x},${y}`))];

    console.log(xs, stringed);

    return stringed.length;
  });

  console.log(basins.sort((a, b) => b - a));

  const topThree = basins
    .slice()
    .sort((a, b) => b - a)
    .slice(0, 3);

  console.log(topThree);

  return topThree.reduce((p, e) => p * e, 1);
};

const td = handleData(testData);
const d = handleData(dataString);

// console.log(findLowPoints(td));
console.log(partTwo(td));
console.log(partTwo(d));
// console.log(findLowPoints(handleData(dataString)));
