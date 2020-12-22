import { strictEqual } from 'assert';
import { data } from './data/5';
import { ObjectKeys } from './types.d';

const testData = {
  BFFFBBFRRR: { row: 70, column: 7, id: 567 },
  FFFBBBFRRR: { row: 14, column: 7, id: 119 },
  BBFFBBFRLL: { row: 102, column: 4, id: 820 },
};

const getId = (input: string): number => {
  const binaryString = input.replace(/(F|L)/g, '0').replace(/(B|R)/g, '1');
  return parseInt(binaryString, 2);
};

(Object.keys(testData) as ObjectKeys<typeof testData>).forEach((key) => {
  strictEqual(getId(key), testData[key].id);
});

const myId = data
  .split('\n')
  .map((val) => getId(val))
  .sort((a, b) => a - b)
  .reduce((prev, curr, index, arr) => {
    const next = arr[index + 1];
    const prospectiveNext = curr + 1;

    return index > 0 && typeof next !== 'undefined' && prospectiveNext !== next
      ? prospectiveNext
      : prev;
  }, undefined as number | undefined);

console.log(myId);
