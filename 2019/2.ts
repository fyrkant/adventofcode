import { data } from './data/2';
import { strictEqual } from 'assert';
import { splitMap } from '../utils';

const compute = (input: number[]) => {
  let index = 0;
  const arr = [...input];
  while (true) {
    const opcode = arr[index];
    const [p1, p2, dest] = arr.slice(index + 1);
    switch (opcode) {
      case 1: {
        const sum = arr[p1] + arr[p2];
        arr[dest] = sum;
        break;
      }

      case 2: {
        const sum = arr[p1] * arr[p2];
        arr[dest] = sum;
        break;
      }

      case 99: {
        return arr[0];
      }

      default:
        break;
    }
    index = index + 4;
  }
};

const strToData = (input: string) =>
  splitMap(input, (x) => parseInt(x, 10), ',');

strictEqual(compute(strToData('1,9,10,3,2,3,11,0,99,30,40,50')), 3500);
const d = strToData(data);
const d2 = [d[0], 12, 2, ...d.slice(3)];

const replaceArrVal = (arr: number[], index: number, newVal: number) => {
  return [...arr.slice(0, index), newVal, ...arr.slice(index + 1)];
};

const computeWithInput = (
  inputData: number[],
  [inputOneIndex, inputOneValue]: [number, number],
  [inputTwoIndex, inputTwoValue]: [number, number]
) => {
  const d2 = replaceArrVal(
    replaceArrVal(inputData, inputOneIndex, inputOneValue),
    inputTwoIndex,
    inputTwoValue
  );
  return compute(d2);
};

strictEqual(computeWithInput(strToData(data), [1, 12], [2, 2]), 4945026);

const findNounAndVerb = (input: number[], goalNum: number) => {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const v = computeWithInput(input, [1, noun], [2, verb]);

      if (v === goalNum) {
        return 100 * noun + verb;
      }
    }
  }
};

strictEqual(findNounAndVerb(strToData(data), 19690720), 5296);
