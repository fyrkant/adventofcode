import { dataString } from './data/25';
import { strictEqual } from 'assert';
import * as R from 'remeda';

const data = {
  card: 13135480,
  door: 8821721,
};

const testData = {
  card: 5764801,
  door: 17807724,
};

const findValueFromLoopSize = (subject: number, loopSize: number) => {
  let v = 1;
  for (let loop = 0; loop < loopSize; loop++) {
    v = v * subject;
    v = v % 20201227;
  }

  return v;
};

const findLoopSize = (subjectNum: number, wantedNum: number) => {
  let v = 1;
  let loop = 0;
  debugger;
  do {
    loop++;
    v = v * subjectNum;
    v = v % 20201227;
  } while (v !== wantedNum);
  return [loop, v];
};

const findKey = (initialSubject: number, cardPub: number, doorPub: number) => {
  debugger;
  const [cardLoopSize] = findLoopSize(initialSubject, cardPub);
  const key = findValueFromLoopSize(doorPub, cardLoopSize);
  return key;
};

console.log(findKey(7, testData.card, testData.door));
console.log(findKey(7, data.card, data.door));
