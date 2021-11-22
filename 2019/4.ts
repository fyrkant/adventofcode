import { strictEqual } from 'assert';

const isSixDigit = (num: number) => {
  return num.toString().length === 6;
};

const isIncreasing = (num: number) => {
  const stringed = num.toString().split('');
  for (let index = 0; index < stringed.length; index++) {
    const curr = parseInt(stringed[index], 10);
    const prev = parseInt(stringed[index - 1], 10);
    if (index !== 0 && curr < prev) {
      return false;
    }
  }
  return true;
};

const hasDouble = (num: number): boolean => {
  const match = num.toString().match(/(.)\1+/g) || [];

  for (let m of match) {
    if (m.length === 2) {
      return true;
    }
  }
  return false;
};

const testPass = (input: number): boolean => {
  return isSixDigit(input) && isIncreasing(input) && hasDouble(input);
};

strictEqual(testPass(111122), true);
strictEqual(testPass(112233), true);
strictEqual(testPass(123444), false);

const findPass = (): number[] => {
  const numbers: number[] = [];
  for (let index = 265275; index < 781584; index++) {
    if (testPass(index)) {
      numbers.push(index);
    }
  }

  return numbers;
};

console.log(findPass().length);
