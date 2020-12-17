import { data } from './data/14';
import { strictEqual } from '../assert.bundle';

const testData = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;

const toBinary = (n: number) => {
  return (n >>> 0).toString(2).padStart(36, '0');
};

const makeData = (input: string) => {
  const arr = input.split('\n');
  return arr.reduce((p, line, i, a) => {
    if (line.startsWith('mask')) {
      const [, mask] = line.split(' = ');
      p.push({ mask, mems: [] });
      return p;
    }
    const [mem, val] = line.split(' = ');
    const [, pos] = /^mem\[([0-9]+)\]$/.exec(mem) || [];
    p[p.length - 1].mems.push([parseInt(pos, 10), parseInt(val, 10)]);
    return p;
  }, [] as { mask: string; mems: [number, number][] }[]);
};

strictEqual(makeData(testData), [
  {
    mask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
    mems: [
      [8, 11],
      [7, 101],
      [8, 0],
    ],
  },
]);

const maskBit = (value: number, mask: string) => {
  const valueBits = toBinary(value).split(''); //.map((x) => parseInt(x, 10));

  for (let index = 0; index < mask.length; index++) {
    const element = mask[index];

    if (element !== 'X') {
      // const v = parseInt(element, 10);
      valueBits[index] = element;
    }
  }

  const x = parseInt(valueBits.join(''), 2);
  return x;
};

const fact = (num: number) => {
  var rval = 1;
  for (let i = 2; i <= num; i++) {
    rval = rval * i;
  }
  return rval;
};

const getAllCombinations = (len: number) => {
  const retArr: string[] = [];
  const realLength = fact(len) + 2;

  for (let index = 0; index < realLength; index++) {
    retArr[index] = toBinary(index).slice(36 - len);
  }

  return retArr;
};

strictEqual(getAllCombinations(3), [
  '000',
  '001',
  '010',
  '011',
  '100',
  '101',
  '110',
  '111',
]);

const getFloatingBitPositions = (value: number, mask: string): number[] => {
  const valueBits = toBinary(value).split(''); //.map((x) => parseInt(x, 10));
  const returnArr: number[] = [];
  let floatCount = 0;
  for (let index = 0; index < mask.length; index++) {
    const element = mask[index];

    if (element === '1' || element === 'X') {
      // const v = parseInt(element, 10);
      if (element === 'X') {
        floatCount++;
      }
      valueBits[index] = element;
    }
  }

  const floatCombinations = getAllCombinations(floatCount);

  const nums = floatCombinations.map((floatString) => {
    let s = valueBits.join('');
    for (let i = 0; i < floatString.length; i++) {
      const element = floatString[i];

      s = s.replace('X', element);
    }
    return parseInt(s, 2);
  });
  debugger;
  return nums;
};

strictEqual(maskBit(11, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'), 73);

const maskBits = (input: ReturnType<typeof makeData>) => {
  const mem = new Map<number, number>();
  for (let index = 0; index < input.length; index++) {
    const { mask, mems } = input[index];
    mems.forEach(([pos, val]) => {
      mem.set(pos, maskBit(val, mask));
    });
  }
  let sum = 0;
  for (const v of mem.values()) {
    sum = sum + v;
  }

  return sum;
};
const maskFloatingBits = (input: ReturnType<typeof makeData>) => {
  const mem = new Map<number, number>();
  for (let index = 0; index < input.length; index++) {
    const { mask, mems } = input[index];
    mems.forEach(([pos, val]) => {
      getFloatingBitPositions(pos, mask).forEach((p) => {
        // console.log({ p, val });
        mem.set(p, val);
      });
    });
  }
  let sum = 0;
  for (const v of mem.values()) {
    sum = sum + v;
  }
  return sum;
};

// strictEqual(maskBits(makeData(testData)), 165);
// strictEqual(maskBits(makeData(data)), 13476250121721);

const testData2 = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;

strictEqual(maskFloatingBits(makeData(testData2)), 208);
console.log(maskFloatingBits(makeData(data)));
