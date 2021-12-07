import { dataString } from './data/06';
import { strictEqual } from 'assert';
const testData = '3,4,3,1,2';

const handleData = (input: string): number[] =>
  input.split(',').map((x) => parseInt(x, 10));

const increaseMap = (m: Map<number, number>, key: number, increase: number) => {
  const prev = m.get(key) || 0;

  m.set(key, prev + increase);
};

const fishy = (startData: number[], turns: number): number => {
  let dataMap = new Map<number, number>();
  for (const f of startData) {
    increaseMap(dataMap, f, 1);
  }
  // let data = new Array(...startData);
  for (let day = 0; day < turns; day++) {
    let newMap = new Map<number, number>();
    dataMap.forEach((v, k) => {
      if (k === 0) {
        increaseMap(newMap, 6, v);
        increaseMap(newMap, 8, v);
      } else {
        increaseMap(newMap, k - 1, v);
        // data[index] = fish - 1;
      }
    });
    dataMap = newMap;
    // for (const [index, fish] of data.entries()) {
    // }
    // for (let i = 0; i < newFishes; i++) {
    //   data.push(8)
    // }
  }

  let sum = 0;

  for (const v of dataMap.values()) {
    sum = sum + v;
  }

  return sum;
};
const td = handleData(testData);
const d = handleData(dataString);
console.log(fishy(d, 256));
