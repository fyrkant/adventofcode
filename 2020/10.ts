import { data } from "./data/10.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";
import { replaceArrVal, splitMap } from "../utils.ts";

const parseLine = (input: string) => {
  return parseInt(input, 10);
};

const makeData = (input: string) => {
  return splitMap(input, parseLine);
};

const testData = `
1
4
5
6
7
10
11
12
15
16
19
`;
// odd: 6 even: 5
const getJolts = (input: number[]) => {
  const result = { one: 0, three: 0 };
  const sorted = input.sort((a, b) => a - b);
  const end = sorted[sorted.length - 1] + 3;
  const sortedWithEnd = [0, ...sorted, end];

  // console.log(sortedWithEnd.length);

  // const x = sortedWithEnd.reduce((p, c) => p + c, 0) % sorted.length;

  // console.log({ x });

  // let prev = null;
  // for (const curr of sortedWithEnd) {
  //   const diff = curr - (typeof prev === "number" ? prev : start);
  //   console.log({ start, prev, curr, diff });

  //   if (diff === 1) {
  //     result["one"] += 1;
  //   } else if (diff === 3) {
  //     result["three"] += 1;
  //   } else if (diff > 3 || diff < 1) {
  //     return false;
  //   }
  //   prev = curr;
  // }
  for (let index = 0; index < sortedWithEnd.length; index++) {
    const adapter = sortedWithEnd[index];
    const nextAdapter = sortedWithEnd[index + 1];

    const diff = nextAdapter - adapter;
    // console.log({ index, nextAdapter, adapter, diff });

    if (diff === 1) {
      result["one"] += 1;
    } else if (diff === 3) {
      result["three"] += 1;
    } else if (diff > 3 || diff < 1) {
      return false;
    }

    // console.log({ index, prevAdapter, adapter });
  }

  // console.log(result);

  return result;
};

const testData2 = `
1
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
49
`;

assertEquals(getJolts(makeData(testData)), { one: 7, three: 5 });
assertEquals(getJolts(makeData(testData2)), { one: 22, three: 10 });

const hasMatch = (num: number, nums: number[]) => {
};

// const getResult = (input: ReturnType<typeof getJolts>): number => {
//   return input["one"] * input["three"];
// };

// assertEquals(getResult(getJolts(makeData(data))), 2470);

const getAllArrangements = function* (
  input: number[],
  entries?: IterableIterator<string>,
): Generator<string> {
  const resultSet = new Set<string>(entries);
  const sortedArr = input.sort((a, b) => a - b);

  // if (!resultSet.has(sortedArr.toString()) && getJolts(sortedArr)) {
  //   resultSet.add(sortedArr.toString());
  // }

  for (let index = 0; index < sortedArr.length - 1; index++) {
    const arr = replaceArrVal(sortedArr.slice(), index);
    const stringified = arr.toString();
    // console.log({ stringified, a: sortedArr.slice(0, index).toString() });
    if (!resultSet.has(stringified) && getJolts(arr)) {
      yield stringified;
      resultSet.add(stringified);
      for (const x of getAllArrangements(arr, resultSet.keys())) {
        yield x;
      }
    }
  }

  // resultSet.forEach((x) => console.log(x));

  // return resultSet;
};

const factorialize = (num: number) => {
  if (num === 0 || num === 1) {
    return 1;
  }
  for (let i = num - 1; i >= 1; i--) {
    num *= i;
  }
  return num;
};

const testarr = makeData(testData).sort((a, b) => a - b);
const testarr2 = makeData(testData2).sort((a, b) => a - b);
// debugger;
console.log(testarr.length);
console.log(
  testarr.reduce((a, b) => a + b),
  factorialize(8),
);

// const s = new Set<string>();

// for (const v of getAllArrangements(testarr2)) {
//   console.log(v);
//   s.add(v);
// }
// console.log(s.size);
// r.forEach((x) => console.log(x));
// assertEquals(r.size, 8);
// assertEquals(getAllArrangements(makeData(testData2)).size + 1, 19208);
// assertEquals(getAllArrangements(makeData(data)).size + 1, 19208);
