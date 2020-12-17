import { data } from './data/17';
import { strictEqual, deepStrictEqual } from 'assert';
import { splitMap } from '../utils';
import _, { zipObject } from 'lodash';

const active = '#';
const inactive = '.';

const testData = `.#.
..#
###`;

const makeData = (input: string) => {
  return splitMap(input, (x) => x.split(''));
};

deepStrictEqual(makeData(testData), [
  ['.', '#', '.'],
  ['.', '.', '#'],
  ['#', '#', '#'],
]);

const getFromDelta = (
  grid: string[][],
  [newLineIndex, newCubeIndex]: [number, number]
): string | false => {
  const newLine = grid[newLineIndex];
  if (!newLine) return false;
  const newCube = newLine[newCubeIndex];
  if (!newCube) return false;

  return newCube;
};

const countSurroundingCubes2d = (
  arr: string[][],
  lineIndex: number,
  cubeIndex: number
) => {
  const deltas = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return deltas.reduce((p, [newLineIndex, newCubeIndex]) => {
    const newCube = getFromDelta(arr, [
      lineIndex + newLineIndex,
      cubeIndex + newCubeIndex,
    ]);
    if (!newCube) return p;

    return newCube === active ? p + 1 : p;
  }, 0 as number);
};

const countSurroundingCubes3d = (
  dimension: string[][][],
  zIndex: number,
  lineIndex: number,
  cubeIndex: number
) => {
  let count = 0;
  for (let zDelta = -1; zDelta < 2; zDelta++) {
    const grid = dimension[zIndex + zDelta];
    if (zDelta !== 0 && dimension.length < 4) {
      const initialGrid = dimension[1];

      count =
        count + countSurroundingCubes2d(initialGrid, lineIndex, cubeIndex);
    } else if (grid) {
      count = count + countSurroundingCubes2d(grid, lineIndex, cubeIndex);
    }
  }
  return count;
};

const makeEmptyGrid = (len: number) =>
  new Array(len).fill(new Array(len).fill('.'));
const makePocketDimension = (startingDimension: string[][][]): string[][][] => {
  const lineLength = startingDimension[startingDimension.length - 1].length;
  let dimension = [
    startingDimension[0],
    ..._.cloneDeep(startingDimension),
    startingDimension[startingDimension.length - 1],
  ];
  let result: string[][][] = [];
  for (let i = 0; i < startingDimension.length + 2; i++) {
    result.push(makeEmptyGrid(lineLength));
  }
  debugger;
  for (let zIndex = 0; zIndex < dimension.length; zIndex++) {
    let grid = dimension[zIndex];
    // if (!grid) {
    //   grid = _.cloneDeep(emptyGrid);
    //   dimension = [
    //     ...dimension.slice(0, zIndex),
    //     grid,
    //     ...dimension.slice(zIndex),
    //   ];
    // }
    for (let lineIndex = 0; lineIndex < grid.length; lineIndex++) {
      const cubes = grid[lineIndex];
      for (let cubeIndex = 0; cubeIndex < cubes.length; cubeIndex++) {
        const cube = cubes[cubeIndex];
        const surroundingActiveCubeCount = countSurroundingCubes3d(
          dimension,
          zIndex,
          lineIndex,
          cubeIndex
        );
        if (cube === active) {
          result[zIndex][lineIndex][cubeIndex] =
            surroundingActiveCubeCount < 1 && surroundingActiveCubeCount < 4
              ? active
              : inactive;
        } else if (cube === inactive && surroundingActiveCubeCount === 3) {
          result[zIndex][lineIndex][cubeIndex] = active;
        }
        console.log(zIndex);
        result[zIndex][lineIndex][cubeIndex] = cube;
      }
    }
  }
  debugger;
  return result;
};

console.log(
  makePocketDimension([makeData(testData)])
    .map((grid) => grid.map((line) => line.join('')).join('\n'))
    .join('\n\n')
);
