import {  dataString } from './data/02';
import {  strictEqual,  deepStrictEqual } from 'assert';
import {  splitMap } from '../utils';

type Direction = 'forward' | 'up' | 'down';

const testDataString = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;
const mapFun = (s: string): [Direction, number] => {
  const [d, n] = s.split(' ');

  return [d as Direction, parseInt(n, 10)];
};

const doThings = (
  d: [Direction, number][]
): [horizontal: number, vertical: number] => {
  let horizontal = 0;
  let vertical = 0;

  d.forEach(([d, n]) => {
    console.log(d, n)
    switch (d) {
      case 'forward':
        horizontal = horizontal + n;

        break;
      case 'up':
        vertical = vertical - n;

        break;
      case 'down':
        vertical = vertical + n;

        break;

      default:
        break;
    }
  });

  return [horizontal, vertical];
};

const doThingsWithAim = (
  d: [Direction, number][]
): [horizontal: number, vertical: number] => {
  let horizontal = 0;
  let vertical = 0;
  let aim = 0;

  d.forEach(([d, n]) => {
    console.log(d, n)
    switch (d) {
      case 'forward':
        horizontal = horizontal + n;
        vertical = vertical + (aim * n)

        break;
      case 'up':
        aim = aim - n;

        break;
      case 'down':
        aim = aim + n;

        break;

      default:
        break;
    }
  });

  return [horizontal, vertical];
};
const td = splitMap(testDataString, mapFun);
const rd = splitMap(dataString, mapFun);
console.log(td);
deepStrictEqual(doThings(td), [15, 10]);
deepStrictEqual(doThingsWithAim(td), [15, 60]);
deepStrictEqual(doThings(rd), [2003, 980]);
deepStrictEqual(doThingsWithAim(rd), [2003, 905474]);

console.log(2003 * 905474)

