import { data } from './data/15';

const makeData = (input: string): number[] => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const doTheThing = (input: number[], end = 2020) => {
  const res = [...input];

  for (let index = input.length; index < end; index++) {
    const prevNum = res[index - 1];
    const prevTurn = res.lastIndexOf(prevNum, res.length - 2);
    if (prevTurn === -1) {
      res.push(0);
    } else {
      const newNum = index - (prevTurn + 1);
      res.push(newNum);
    }
  }

  return res[res.length - 1];
};

const doTheThingMap = (input: number[], end = 2020) => {
  const spokenNumbersMap = new Map<number, number[]>();
  input.forEach((v, i) => spokenNumbersMap.set(v, [i + 1]));
  let lastSpoken = input[input.length - 1];
  for (
    let currentTurn = input.length + 1;
    currentTurn < end + 1;
    currentTurn++
  ) {
    const lastTimesSpoken = spokenNumbersMap.get(lastSpoken) || [];
    const newNum =
      lastTimesSpoken.length < 2
        ? 0
        : lastTimesSpoken[lastTimesSpoken.length - 1] -
          lastTimesSpoken[lastTimesSpoken.length - 2];
    lastSpoken = newNum;
    const p = spokenNumbersMap.get(newNum) || [];
    spokenNumbersMap.set(newNum, [...p.slice(p.length - 1), currentTurn]);
  }
  return lastSpoken;
};

// console.log(doTheThingMap(makeData(data)));

const testData = {
  '0,3,6': 436,
  '1,3,2': 1,
  '2,1,3': 10,
  '1,2,3': 27,
  '2,3,1': 78,
  '3,2,1': 438,
  '3,1,2': 1836,
  [data]: 403,
};
const testData2 = {
  '0,3,6': 175594,
  '1,3,2': 2578,
  '2,1,3': 3544142,
  '1,2,3': 261214,
  '2,3,1': 6895259,
  '3,2,1': 18,
  '3,1,2': 362,
};

// console.log(doTheThingMap(makeData("0,3,6"), 30000000));

// Object.entries(testData).forEach(([key, val]) => {
//   assertEquals(doTheThingMap(makeData(key)), val);
// });
// Object.entries(testData2).forEach(([key, val]) => {
//   assertEquals(doTheThing(makeData(key), 30000000), val);
// });

console.log(doTheThingMap(makeData('0,3,6'), 30000000));
