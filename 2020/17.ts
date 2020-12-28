import * as R from 'remeda';
import { data } from './data/17';
import { splitMap } from '../utils';

const active = '#';
const inactive = '.';

const testData = `.#.
..#
###`;

const makeData = (input: string): string[][] => {
  return splitMap(input, (v) => v.split(''));
};

const getCubeFromCoords = (
  dimension: string[][][][],
  w: number,
  z: number,
  y: number,
  x: number
): '.' | '#' => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return R.pathOr(dimension as any, [w, z, y, x] as any, '.');
};

const countSurrounding = (
  dimension: string[][][][],
  w: number,
  z: number,
  y: number,
  x: number
) => {
  let count = 0;

  for (let deltaW = w - 1; deltaW < w + 2; deltaW++) {
    for (let deltaZ = z - 1; deltaZ < z + 2; deltaZ++) {
      for (let deltaY = y - 1; deltaY < y + 2; deltaY++) {
        for (let deltaX = x - 1; deltaX < x + 2; deltaX++) {
          if (!(deltaX === x && deltaY === y && deltaZ === z && deltaW === w)) {
            const cube = getCubeFromCoords(
              dimension,
              deltaW,
              deltaZ,
              deltaY,
              deltaX
            );
            count = count + (cube === active ? 1 : 0);
          }
        }
      }
    }
  }

  return count;
};

const makePocketDimension = (dimension: string[][][][]): string[][][][] => {
  const result: string[][][][] = [[[[]]]];

  for (let wIndex = 0; wIndex < dimension.length + 2; wIndex++) {
    result[wIndex] = [];
    for (let zIndex = 0; zIndex < dimension[0].length + 2; zIndex++) {
      result[wIndex][zIndex] = [];
      for (
        let lineIndex = 0;
        lineIndex < dimension[0][0].length + 2;
        lineIndex++
      ) {
        result[wIndex][zIndex][lineIndex] = [];
        for (
          let cubeIndex = 0;
          cubeIndex < dimension[0][0][0].length + 2;
          cubeIndex++
        ) {
          const cube = getCubeFromCoords(
            dimension,
            wIndex - 1,
            zIndex - 1,
            lineIndex - 1,
            cubeIndex - 1
          );

          const surroundingActiveCubeCount = countSurrounding(
            dimension,
            wIndex - 1,
            zIndex - 1,
            lineIndex - 1,
            cubeIndex - 1
          );
          let newStatus = null;
          if (cube === active) {
            newStatus =
              surroundingActiveCubeCount === 2 ||
              surroundingActiveCubeCount === 3
                ? active
                : inactive;
          } else {
            newStatus = surroundingActiveCubeCount === 3 ? active : inactive;
          }
          result[wIndex][zIndex][lineIndex][cubeIndex] = newStatus;
        }
      }
    }
  }
  debugger;
  return result;
};

const runCyclesAndCount = (input: string, cycles: number) => {
  let d: string[][][][] = [[makeData(input)]];

  R.times(cycles, () => {
    d = makePocketDimension(d);
  });

  return R.flattenDeep(d).filter((x) => x === active).length;
};

console.log(runCyclesAndCount(data, 6));
