import { dataString } from './data/11.ts';

import { assertEquals } from 'https://deno.land/std@0.117.0/testing/asserts.ts';

const testData = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

const handleData = (data: string): number[][] => {
  return data.split('\n').map((row) => row.split('').map(Number));
};

Deno.test({
  name: 'data',
  fn: () => {
    assertEquals(
      handleData(`123
456`),
      [
        [1, 2, 3],
        [4, 5, 6],
      ]
    );
  },
});

const step = (data: number[][]): [number[][], number] => {
  const arr = data.slice();
  const flashed = new Set<string>();

  const flash = (x: number, y: number) => {
    flashed.add(`${x},${y}`);

    arr[x][y] = 0;

    [x - 1, x, x + 1].forEach((nx) => {
      [y - 1, y, y + 1].forEach((ny) => {
        if (
          nx === -1 ||
          nx > 9 ||
          ny > 9 ||
          ny === -1 ||
          flashed.has(`${nx},${ny}`)
        ) {
          return;
        }
        const el = arr[nx][ny];
        arr[nx][ny] = el + 1;
      });
    });
  };
  for (let x = 0; x < arr.length; x++) {
    const line = arr[x];
    for (let y = 0; y < line.length; y++) {
      const el = line[y];

      arr[x][y] = el + 1;
    }
  }
  while (arr.flat().some((x) => x > 9)) {
    for (let x = 0; x < arr.length; x++) {
      const line = arr[x];
      for (let y = 0; y < line.length; y++) {
        const el = line[y];

        if (el > 9) {
          flash(x, y);
        }
      }
    }
  }
  return [arr, flashed.size];
};

const partOne = (data: number[][], steps: number): number => {
  let arr = data.slice();
  let flashed = 0;

  for (let index = 0; index < steps; index++) {
    const [a, f] = step(arr);

    if (f === 100) {
      return index + 1;
    }

    arr = a;
    flashed = flashed + f;
  }

  return flashed;
};

const td = handleData(testData);
const d = handleData(dataString);
assertEquals(partOne(td, 100), 1656);
assertEquals(partOne(d, 1000), 1659);
