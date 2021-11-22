import { data } from './data/3';
import { strictEqual, notStrictEqual } from 'assert';
import { splitMap } from '../utils';
import * as R from 'remeda';

type Direction = 'R' | 'L' | 'U' | 'D';

const parseLine = (input: string): [Direction, number][] => {
  return input.split(',').map((e) => {
    const [direction, ...num] = e;
    return [direction as Direction, parseInt(num.join(''), 10)];
  });
};

const testData = `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`;

notStrictEqual(
  [
    ['R', 75],
    ['D', 30],
    ['R', 83],
    ['U', 83],
    ['L', 12],
  ],
  parseLine('R75,D30,R83,U83,L12')
);

// const findDuplicates = ([arr1: string[], arr2: string[]]): [number, number][] => {
//   const uniqueElements = new Set(arry);
//   const filtered = arry.filter((item) => {
//     if (uniqueElements.has(item)) {
//       uniqueElements.delete(item);
//       return false;
//     } else {
//       return true;
//     }
//   });

//   console.log(filtered);
//   return [...new Set(filtered)].map((e) => {
//     const [x, y] = e.split(',');

//     return [parseInt(x, 10), parseInt(y, 10)] as [number, number];
//   });
// };

// get all duplicate positions
const getCrossedPoints = (input: [Direction, number][][]) => {
  const cables: Map<string, number>[] = [];

  for (let line = 0; line < input.length; line++) {
    const cable = input[line];
    let [x, y] = [0, 0];
    const positions: string[] = [];
    const posMap = new Map<string, number>();

    let step = 0;
    for (let index = 0; index < cable.length; index++) {
      const [direction, number] = cable[index];
      for (let i = 0; i < number; i++) {
        if (direction === 'R') {
          y++;
        } else if (direction === 'L') {
          y--;
        } else if (direction === 'U') {
          x++;
        } else if (direction === 'D') {
          x--;
        }

        step++;

        posMap.set(`${x},${y}`, step);

        // positions.push(`${x},${y},${step}`);
      }
    }
    cables.push(posMap);
  }

  const [a, b] = cables;

  const getDups = (
    a1: Map<string, number>,
    a2: Map<string, number>
  ): Map<string, number> => {
    const hej = new Set(a1.keys());

    const d: Map<string, number> = new Map();

    for (let key of a2.keys()) {
      if (hej.has(key)) {
        d.set(key, (a2.get(key) || 0) + (a1.get(key) || 0));
      }
    }

    return d;
  };

  const dups = getDups(a, b);
  const arry = Array.from(dups.entries())
    .map(([pos, step]) => {
      const [x, y] = pos.split(',');

      return [parseInt(x, 10), parseInt(y, 10), step] as [
        number,
        number,
        number
      ];
    })
    .filter(([x, y]) => x !== 0 && y !== 0)
    .map(([x, y, step]) => [Math.abs(x) + Math.abs(y), step])
    .sort(([a, as], [b, bs]) => as - bs);
  // console.log(dups);
  const retrtr = arry;
  return retrtr;
};

console.log(
  getCrossedPoints(
    `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`
      .split('\n')
      .map(parseLine)
  )
);
console.log(getCrossedPoints(data.split('\n').map(parseLine)));
