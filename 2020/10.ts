import { data } from "./data/10.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { replaceArrVal, splitMap } from "../utils.ts";

const parseLine = (input: string) => {
  return parseInt(input, 10);
};

const makeData = (input: string) => {
  return splitMap(input, parseLine);
};

const testData = `1
4
5
6
7
10
11
12
15
16
19`;
// odd: 6 even: 5
const getJolts = (input: number[], start = 0) => {
  const result = { one: 0, three: 0 };
  const sorted = input.sort((a, b) => a - b);
  const end = sorted[sorted.length - 1] + 3;
  const sortedWithEnd = [...sorted, end];

  let prev = start;
  for (const curr of sortedWithEnd) {
    const diff = curr - prev;

    if (diff === 1) {
      result["one"] += 1;
    } else if (diff === 3) {
      result["three"] += 1;
    } else if (diff > 3 || diff < 1) {
      return false;
    }
    prev = curr;
  }

  return result;
};

const testData2 = `1
2
3
4
7
8
9
10
11
14
17
18
19
20
23
24
25
28
31
32
33
34
35
38
39
42
45
46
47
48
49`;

const d1 = makeData(testData);
// console.log(d1, d1.join(","));
const d2 = makeData(testData2);
const isEven = (num: number) => num % 2 === 0;
const getOddEvenCounts = (a: number[]) => {
  return a.reduce((p, c) => {
    const even = isEven(c);
    return { odd: p.odd + Number(!even), even: p.even + Number(even) };
  }, { odd: 0, even: 0 } as { odd: number; even: number });
};
// console.log(getOddEvenCounts(d2));
assertEquals(getJolts(d1), { one: 7, three: 5 });
assertEquals(getJolts(d2), { one: 22, three: 10 });
assertEquals(getJolts(makeData(data)), { one: 65, three: 38 });

const hasMatch = (num: number, nums: number[]) => {
};

// const getResult = (input: ReturnType<typeof getJolts>): number => {
//   return input["one"] * input["three"];
// };

// assertEquals(getResult(getJolts(makeData(data))), 2470);

// const getAllArrangements = function* (
//   input: number[],
//   entries?: IterableIterator<string>,
// ): Generator<string> {
//   const resultSet = new Set<string>(entries);
//   const sortedArr = input.sort((a, b) => a - b);

//   // if (!resultSet.has(sortedArr.toString()) && getJolts(sortedArr)) {
//   //   resultSet.add(sortedArr.toString());
//   // }

//   for (let index = 0; index < sortedArr.length - 1; index++) {
//     const arr = replaceArrVal(sortedArr.slice(), index);
//     const stringified = arr.toString();
//     // console.log({ stringified, a: sortedArr.slice(0, index).toString() });
//     if (!resultSet.has(stringified) && getJolts(arr)) {
//       yield stringified;
//       resultSet.add(stringified);
//       for (const x of getAllArrangements(arr, resultSet.keys())) {
//         yield x;
//       }
//     }
//   }

//   // resultSet.forEach((x) => console.log(x));

//   // return resultSet;
// };

const getArrangements = (
  input: number[],
  resultSet: Set<string>,
): Set<string> => {
  const sortedArr = input.sort((a, b) => a - b);

  if (!resultSet.has(sortedArr.toString()) && getJolts(sortedArr)) {
    resultSet.add(sortedArr.toString());
  }

  for (let index = 0; index < sortedArr.length - 1; index++) {
    const arr = replaceArrVal(sortedArr.slice(), index);
    const stringified = arr.toString();
    if (!resultSet.has(stringified) && getJolts(arr)) {
      // yield stringified;
      resultSet.add(stringified);
      getArrangements(arr, resultSet);
    }
  }

  // resultSet.forEach((x) => console.log(x));

  return resultSet;
};

const s = new Set<string>();

getArrangements(d1, s);

console.log(s.size);
const s2 = new Set<string>();

getArrangements(d2, s2);

console.log(s2.size);
const s3 = new Set<string>();

getArrangements(makeData(data), s3);

console.log(s3.size);

// r.forEach((x) => console.log(x));
// assertEquals(r.size, 8);
// assertEquals(getAllArrangements(makeData(testData2)).size + 1, 19208);
// assertEquals(getAllArrangements(makeData(data)).size + 1, 19208);
