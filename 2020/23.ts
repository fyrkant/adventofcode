import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { splitMap } from '../utils';
import * as R from 'remeda';
import { memoize } from 'lodash';

import { Circular, Node } from 'singlie';

const testDataString = `389125467`;

const makeData = (input: string) => splitMap(input, (x) => parseInt(x, 10), '');

// const takeWrapping = (
//   xs: number[],
//   startIndex: number,
//   amount: number
// ): [picked: number[], rest: number[]] => {
//   const endIndex = (startIndex + amount) % xs.length;
//   if (endIndex !== 0 && endIndex < startIndex) {
//     const pickedStart = xs.slice(startIndex);
//     const pickedEnd = xs.slice(0, endIndex);
//     const picked = pickedStart.concat(pickedEnd);
//     const rest = R.difference(xs, picked);
//     return [picked, rest];
//   } else {
//     const picked = xs.slice(startIndex, startIndex + amount);
//     const rest = R.difference(xs, picked);
//     return [picked, rest];
//   }
// };

// deepStrictEqual(takeWrapping([3, 8, 9, 1, 2, 5, 4, 6, 7], 1, 3), [
//   [8, 9, 1],
//   [3, 2, 5, 4, 6, 7],
// ]);
// deepStrictEqual(takeWrapping([1, 2, 3, 4, 5, 6, 7], 5, 3), [
//   [6, 7, 1],
//   [2, 3, 4, 5],
// ]);
// deepStrictEqual(takeWrapping([1, 2, 3, 4, 5, 6, 7], 0, 3), [
//   [1, 2, 3],
//   [4, 5, 6, 7],
// ]);
// deepStrictEqual(takeWrapping([1, 2, 3, 4, 5, 6, 7], 4, 3), [
//   [5, 6, 7],
//   [1, 2, 3, 4],
// ]);
// deepStrictEqual(takeWrapping([1, 2, 3, 4, 5, 6, 7], 3, 3), [
//   [4, 5, 6],
//   [1, 2, 3, 7],
// ]);

// const getMinMax = (xs: number[]): [min: number, max: number] => {
//   let max = 0;
//   let min = Infinity;
//   let a = xs.length;
//   for (let index = 0; index < a; index++) {
//     let v = xs[index];
//     if (v < min) {
//       min = v;
//     }
//     if (v > max) {
//       max = v;
//     }
//   }
//   return [min, max];
// };

// const memoizedMinMax = memoize(getMinMax);

// const findDestinationCupIndex = (
//   xs: number[],
//   start: number,
//   currentCup: number
// ) => {
//   const [min, max] = memoizedMinMax(xs);
//   let current = start;
//   while (true) {
//     const i = xs.indexOf(current);

//     if (i !== -1 && xs[i] !== currentCup) {
//       console.log({ current, i });
//       return i;
//     } else {
//       current--;
//       if (current < min) {
//         current = max;
//       }
//     }
//   }
// };

const findDestinationIndex = (
  list: Circular<number>,
  start: number,
  currentCupIndex: number,
  max: number
) => {
  let current = start;
  while (true) {
    const i = list.indexOf(current);
    if (i !== -1 && i !== currentCupIndex) {
      return i;
    } else {
      current = current - 1;
      if (current < 1) {
        current = max;
      }
    }
  }
};

// deepStrictEqual(findDestinationCupIndex([7, 2, 5, 8, 4, 6], 1, 8), 0);
// deepStrictEqual(findDestinationCupIndex([3, 2, 5, 8, 9, 1], 4, 5), 0); //3

const runGameCircularList = (input: number[], moves: number) => {
  const list = new Circular<number>();
  let max = 0;
  input.forEach((n) => {
    if (n > max) {
      max = n;
    }
    list.append(n);
  });
  console.log(list.length, max);

  let currentCupIndex = 0;

  for (let move = 0; move < moves; move++) {
    if (move % 1000 === 0) {
      console.log({ move });
    }
    const currentCup = list.node(currentCupIndex);
    const destinationVal = currentCup.value - 1;
    const picked: number[] = [];
    for (let pickedNum = 0; pickedNum < 3; pickedNum++) {
      if (currentCup.next) {
        picked.push(currentCup.next.value);
        list.remove(list.indexOf(currentCup.next.value));
      }
    }
    const destinationIndex = findDestinationIndex(
      list,
      destinationVal,
      currentCupIndex,
      max
    );
    // debugger;
    // debugger;

    list.insert({ value: picked.reverse(), index: destinationIndex + 1 });
    const nextCup = currentCup.next;
    if (nextCup) {
      currentCupIndex = list.indexOf(nextCup.value);
    } else {
      throw new Error('oh no');
    }
  }
  const oneIndex = list.indexOf(1);
  const oneNode = list.node(oneIndex);
  let str = '';
  let nextNode = oneNode.next;
  for (let index = 0; index < list.length - 1; index++) {
    if (nextNode) {
      str = str + String(nextNode.value);
      nextNode = nextNode.next;
    }
  }
  console.log(str);
  const first = oneNode.next;
  if (first) {
    const second = first.next;

    return [first.value, second ? second.value : 0];
  }
};

// const runGame = (input: number[], moves: number) => {
//   let cups = R.clone(input);
//   // const sortedList = R.sort(cups, (a, b) => a - b);
//   // const lowestValue = sortedList[0];
//   // const highestValue = sortedList[sortedList.length - 1];
//   let move = 0;
//   let currentCupIndex = 0;
//   do {
//     move++;
//     // if (100 % move === 0) {
//     console.log({ move });
//     // }
//     const currentCup = cups[currentCupIndex];
//     const [picked, rest] = takeWrapping(cups, currentCupIndex + 1, 3);
//     const destinationVal = currentCup - 1;
//     const destinationIndex = findDestinationCupIndex(
//       rest,
//       destinationVal,
//       currentCup
//     );
//     const newCups = [
//       ...rest.slice(0, destinationIndex + 1),
//       ...picked,
//       ...rest.slice(destinationIndex + 1),
//     ];
//     const newCurrentIndex = newCups.indexOf(currentCup);
//     const newCupIndex = (newCurrentIndex + 1) % cups.length;

//     // debugger;
//     cups = newCups;
//     currentCupIndex = newCupIndex;
//   } while (move < moves);

//   const oneIndex = cups.indexOf(1);
//   console.log(oneIndex);
//   const one = cups[(oneIndex + 1) % cups.length];
//   const two = cups[(oneIndex + 2) % cups.length];
//   debugger;
//   // const res = [...cups.slice(oneIndex + 1), ...cups.slice(0, oneIndex)].join(
//   //   ''
//   // );
//   // return res;
//   return [one, two];
// };

const makeBigData = (nums: number[], end: number) => {
  const sortedList = R.sort(nums, (a, b) => a - b);
  const highestValue = sortedList[sortedList.length - 1];
  const rest = R.range(highestValue + 1, end + 1);

  return nums.concat(rest);
};

const testData = makeData(testDataString);
const data = makeData('784235916');
const bigData = makeBigData(data, 1000000);
const bigTestData = makeBigData(testData, 1000000);
debugger;

// strictEqual(runGame(testData, 10), '92658374');
console.log(runGameCircularList(bigTestData, 10000000));
// strictEqual(runGame(testData, 100), '67384529');
// strictEqual(runGame(data, 100), '53248976');
