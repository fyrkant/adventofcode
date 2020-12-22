import { strictEqual, deepStrictEqual } from 'assert';
import _, { zipObject } from 'lodash';
import { data } from './data/17';
import { splitMap } from '../utils';

const active = '#';
const inactive = '.';

const testData = `.#.
..#
###`;

const makeEmptyLine = (len: number): string[] => _.times(len, _.constant('.'));

const makeEmptyGrid = (len: number, lineLen = len): string[][] =>
  _.times(len, () => makeEmptyLine(lineLen));

const makeData = (input: string, pad: number): string[][] => {
  const x = splitMap(input, (v) => [
    ...new Array<string>(pad).fill('.'),
    ...v.split(''),
    ...new Array<string>(pad).fill('.'),
  ]);
  const y = [
    ..._.times(pad, () => makeEmptyLine(x.length + pad * 2)),
    ...x,
    ..._.times(pad, () => makeEmptyLine(x.length + pad * 2)),
  ];

  return y;
};

deepStrictEqual(
  makeData(testData, 3)
    .map((l) => l.join(''))
    .join('\n')
    .toString(),
  `.........
.........
.........
....#....
.....#...
...###...
.........
.........
.........`
);

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
  zDelta: number,
  arr: string[][],
  lineIndex: number,
  cubeIndex: number
) => {
  const deltas = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return deltas.reduce((p, [newLineIndex, newCubeIndex]) => {
    if (zDelta === 0 && newLineIndex === 0 && newCubeIndex === 0) {
      return p;
    }
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
  const zDeltas = [-1, 0, 1];
  let count = 0;
  zDeltas.forEach((zDelta) => {
    const grid = dimension[zIndex + zDelta];
    // if (zDelta !== 0 && dimension.length < 4) {
    //   const initialGrid = dimension[1];

    //   count =
    //     count + countSurroundingCubes2d(initialGrid, lineIndex, cubeIndex);
    // } else
    if (grid) {
      count += countSurroundingCubes2d(zDelta, grid, lineIndex, cubeIndex);
    }
  });

  return count;
};

const makePocketDimension = (startingDimension: string[][][]): string[][][] => {
  const lineLength = startingDimension[startingDimension.length - 1].length;
  const dimension = [
    makeEmptyGrid(lineLength),
    ..._.cloneDeep(startingDimension),
    makeEmptyGrid(lineLength),
  ];
  const result: string[][][] = [];
  debugger;
  for (let i = 0; i < startingDimension.length + 2; i++) {
    result.push(makeEmptyGrid(lineLength));
  }
  debugger;
  for (let zIndex = 0; zIndex < dimension.length; zIndex++) {
    const grid = dimension[zIndex];
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
        let newStatus = null;
        if (cube === active) {
          newStatus =
            surroundingActiveCubeCount === 2 || surroundingActiveCubeCount === 3
              ? active
              : inactive;
        } else {
          newStatus = surroundingActiveCubeCount === 3 ? active : inactive;
        }
        result[zIndex][lineIndex][cubeIndex] = newStatus;
        if (newStatus === active) {
          debugger;
        }
      }
    }
  }
  debugger;
  return result;
};

const countAll = (xs: string[][][]): number => {
  return xs.reduce((pg, g) => {
    return (
      pg +
      g.reduce((pl, l) => {
        return (
          pl +
          l.reduce((pc, c) => {
            return pc + (c === active ? 1 : 0);
          }, 0)
        );
      }, 0)
    );
  }, 0);
};

// console.log('all', countAll([makeData(testData, 3)]));

const runCyclesAndCount = (input: string, cycles: number) => {
  let d = [makeData(input, 40)];

  console.log(countAll(d));
  _.times(cycles, () => {
    debugger;
    d = makePocketDimension(d);
    console.log(countAll(d));
  });

  return countAll(d);
};

console.log(runCyclesAndCount(data, 6));

// console.log(
//   makePocketDimension([makeData(testData, 6)])
//     .map((grid) => grid.map((line) => line.join('')).join('\n'))
//     .join('\n\n')
// );
