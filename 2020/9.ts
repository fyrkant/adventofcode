import { data } from './data/9.ts';
import { assertEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts';
import { splitMap } from '../utils.ts';

const parseLine = (input: string): number => {
  return parseInt(input, 10);
};

const testData = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

const checkIsSumOfSomeTwo = (
  sum: number,
  num: number,
  nums: number[]
): boolean => {
  for (const n of nums) {
    console.log(n);
    if (n + num === sum) {
      return true;
    }
  }
  return false;
};

// const check = (sum: number, nums:number[]) => {
//   nums.reduce((prev, ))
// }

// assertEquals(
//   checkIsSumOfSomeTwo(127, 0, splitMap(testData, parseLine).slice(0, 5)),
//   true,
// );

const getFaultyNumber = (
  array: number[],
  preambleLength: number
): number | true => {
  for (let index = preambleLength; index < array.length; index++) {
    const element = array[index];
    const prevNums = array.slice(
      index - preambleLength,
      index + preambleLength
    );
    const x = prevNums.reduce((p, x, i) => {
      console.log({ p, x, i });
      return (
        p ||
        checkIsSumOfSomeTwo(element, x, [
          ...prevNums.slice(0, i),
          ...prevNums.slice(i + 1),
        ])
      );
    }, false);
    if (!x) {
      return element;
    }
  }
  return true;
};

const invalidNum = 90433990;

const findSet = (
  sum: number,
  nums: number[],
  startIndex: number,
  endIndex: number
): Promise<[number, number]> => {
  return new Promise((res, rej) => {
    let acc = 0;
    for (let index = startIndex; index < endIndex; index++) {
      const element = nums[index];
      acc = acc + element;

      if (isNaN(acc)) {
        throw new Error();
      }
      // console.log({ element, acc, index, startIndex, endIndex });
      if (acc > sum) {
        const nextEndIndex = startIndex + 2;
        if (nextEndIndex > nums.length) {
          return rej(false);
        }
        return findSet(sum, nums, startIndex + 1, nextEndIndex).then(res, rej);
      } else if (acc === sum) {
        const ret = [startIndex, endIndex - 1] as [number, number];
        console.log('YESSSS!!!', { ret });
        res(ret);

        return;
      }
    }

    setTimeout(() => {
      return findSet(sum, nums, startIndex, endIndex + 1).then(res, rej);
    });
  });
};

const add = (p: number, c: number) => p + c;

const findSetTwo = (sum: number, nums: number[]): [number, number] | false => {
  return nums.reduce((p, _c, startIndex) => {
    return (
      p ||
      nums.slice(startIndex + 1).reduce((ip, _c, ei) => {
        const endIndex = startIndex + ei + 1;

        return !ip && sum === nums.slice(startIndex, endIndex).reduce(add, 0)
          ? [startIndex, endIndex]
          : ip;
      }, false as false | [number, number])
    );
  }, false as false | [number, number]);
  // for (let startIndex = 0; startIndex < nums.length; startIndex++) {
  //   for (let endIndex = startIndex + 1; endIndex < nums.length; endIndex++) {
  //     let x = 0;

  //     for (let index = startIndex; index < endIndex; index++) {
  //       x = x + nums[index];
  //     }

  //     if (x === sum) {
  //       return [startIndex, endIndex];
  //     }
  //   }
  // }
  // return false;
};

const getSumOfTwo = (
  arr: number[],
  [startIndex, endIndex]: [number, number]
): number => {
  const sorted = arr.slice(startIndex, endIndex).sort((a, b) => a - b);

  const one = sorted[0];
  const two = sorted[sorted.length - 1];

  return one + two;
};

const doStuff = async (arr: number[], num: number) => {
  const inds = await findSet(num, arr, 0, 1);

  return typeof inds !== 'boolean' && getSumOfTwo(arr, inds);
};

const doStuff2 = (arr: number[], num: number) => {
  const inds = findSetTwo(num, arr);

  return typeof inds !== 'boolean' && getSumOfTwo(arr, inds);
};

// assertEquals(findSet(127, splitMap(testData, parseLine), 0, 1), [2, 5]);
// assertEquals(doStuff(splitMap(testData, parseLine), 127), 62);
// console.log(splitMap(data, parseLine).indexOf(90433990));

const test = async (input: string, num: number, expectedNum: number) => {
  return doStuff(splitMap(input, parseLine), num).then((v) => {
    // console.log({ v });
    assertEquals(v, expectedNum);
  });
};
const test2 = async (input: string, num: number, expectedNum: number) => {
  const v = doStuff2(splitMap(input, parseLine), num);
  // console.log({ v });
  assertEquals(v, expectedNum);
};

// findSet(127, splitMap(testData, parseLine), 0, 1).then((x) => {
//   console.log(x);
// });
// findSet(90433990, splitMap(data, parseLine), 0, 1).then((x) => {
//   console.log({ x });
// });

// test(testData, 127, 62);
// test2(testData, 127, 62);
test2(data, 90433990, 11691646);

// console.log(getSumOfTwo(splitMap(data, parseLine), [441, 457]));
