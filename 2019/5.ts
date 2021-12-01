import { dataString } from './data/5';
import { deepStrictEqual as assert } from 'assert';
import { splitMap } from '../utils';

// console.log(dataString);

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;

const getOpCodeAndParameters = (
  n: number
): [opcode: number, parameters: (1 | 0)[]] => {
  const s = n.toString();
  if (s.length === 1) {
    return [n, []];
  } else if (s.length > 1) {
    const opCode = parseInt(s[s.length - 1], 10);
    const params = s
      .split('')
      .slice(0, s.length - 2)
      .reverse()
      .map((x) => (x === '1' ? 1 : 0));

    return [opCode, params];
  }
  return [99, []];
};

assert(getOpCodeAndParameters(1), [1, []]);
assert(getOpCodeAndParameters(1001), [1, [0, 1]]);
assert(getOpCodeAndParameters(11101), [1, [1, 1, 1]]);

const compute = (input: number[], inputVal: number) => {
  let index = 0;
  const arr = [...input];
  const outputs: number[] = [];
  while (true) {
    const op = arr[index];
    console.log(`RAW OPCODE: ${op}`);
    const [opcode, parameters] = getOpCodeAndParameters(op);
    let steps = 0;

    const [p1, p2, dest] = arr.slice(index + 1);

    console.log(opcode, parameters, p1, p2, dest);
    switch (opcode) {
      case 1: {
        const [x, y, z] = parameters;
        const v1 = x === IMMEDIATE_MODE ? p1 : arr[p1];
        const v2 = y === IMMEDIATE_MODE ? p2 : arr[p2];
        const sum = v1 + v2;
        const d = z === IMMEDIATE_MODE ? index + 3 : dest;

        console.log(`ADDING ${v1} + ${v2} = ${sum} TO ${d}`);
        arr[d] = sum;

        steps = 4;
        break;
      }

      case 2: {
        const [x, y, z] = parameters;
        const v1 = x === IMMEDIATE_MODE ? p1 : arr[p1];
        const v2 = y === IMMEDIATE_MODE ? p2 : arr[p2];
        const sum = v1 * v2;
        const d = z === IMMEDIATE_MODE ? index + 3 : dest;

        console.log(`MULTIPLYING ${v1} * ${v2} = ${sum} TO ${d}`);
        arr[d] = sum;

        steps = 4;
        break;
      }

      case 3: {
        const dest = arr[index + 1];
        arr[dest] = inputVal;
        steps = 2;
        console.log(`INPUT ${inputVal} to ${dest}`);
        break;
      }

      case 4: {
        const [a] = parameters;
        const x = a === IMMEDIATE_MODE ? a : arr[p1];
        console.log(`CODE: ${x} index: ${index}`);
        console.log(`OUTPUT! ${outputs.length}`);

        if (outputs.length > 0 && x !== 0) {
          return x;
        }
        outputs.push(x);
        steps = 2;
        break;
      }

      case 99: {
        return arr[0];
      }

      default:
        break;
    }
    console.log(`\n`);
    index = index + steps;
  }
};

const strToData = (input: string) =>
  splitMap(input, (x) => parseInt(x, 10), ',');

// strictEqual(compute(strToData('1,9,10,3,2,3,11,0,99,30,40,50')), 3500);
// const d = strToData(data);
// const d2 = [d[0], 12, 2, ...d.slice(3)];

// const replaceArrVal = (arr: number[], index: number, newVal: number) => {
//   return [...arr.slice(0, index), newVal, ...arr.slice(index + 1)];
// };

// const computeWithInput = (
//   inputData: number[],
//   [inputOneIndex, inputOneValue]: [number, number],
//   [inputTwoIndex, inputTwoValue]: [number, number]
// ) => {
//   const d2 = replaceArrVal(
//     replaceArrVal(inputData, inputOneIndex, inputOneValue),
//     inputTwoIndex,
//     inputTwoValue
//   );
//   return compute(d2);
// };

// assert(computeWithInput(strToData(data), [1, 12], [2, 2]), 4945026);

// const findNounAndVerb = (input: number[], goalNum: number) => {
//   for (let noun = 0; noun < 100; noun++) {
//     for (let verb = 0; verb < 100; verb++) {
//       const v = computeWithInput(input, [1, noun], [2, verb]);

//       if (v === goalNum) {
//         return 100 * noun + verb;
//       }
//     }
//   }
// };
console.log(compute(strToData(dataString), 1));
