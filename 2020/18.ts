import { strictEqual } from 'assert';
import { data } from './data/18';
import { splitMap } from '../utils';

const testData = '1 + 2 * 3 + 4 * 5 + 6';
const testData2 = '1 + (2 * 3) + (4 * (5 + 6))';
const testData3 = '5 + (8 * 3 + 9 + 3 * 4 * 3)';
const testData4 = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2';

const leftToRight = (input: string[]) => {
  let left = '';

  for (let i = 0; i < input.length; i++) {
    const element = input[i];
    if (element === '+6') {
      debugger;
    }
    const lastInChunk = left[left.length - 1];
    if (left === '') {
      left += element;
    } else if (operators.includes(element)) {
      left += element;
    } else if (operators.includes(lastInChunk)) {
      const operator = lastInChunk;
      const leftSide = left.substr(0, left.length - 1);
      const l = parseInt(leftSide, 10);
      const r = parseInt(element, 10);
      left = String(operator === '*' ? l * r : l + r);
    }
  }
  return parseInt(left, 10);
};

const doThing =
  (operator: '*' | '+') =>
  (input: string[]): string[] => {
    const plusIndex = input.indexOf(operator);

    if (plusIndex === -1) {
      return input;
    }
    const one = input[plusIndex - 1];
    const two = input[plusIndex + 1];

    const sum =
      operator === '+'
        ? parseInt(one, 10) + parseInt(two, 10)
        : parseInt(one, 10) * parseInt(two, 10);

    const newArr = [
      ...input.slice(0, plusIndex - 1),
      String(sum),
      ...input.slice(plusIndex + 2),
    ];

    return doThing(operator)(newArr);
  };

const doAddition = doThing('+');
const doMultiplication = doThing('*');

const doItInWeirdOrder = (input: string[]) =>
  parseInt(doMultiplication(doAddition(input))[0], 10);

const operators = ['+', '*'];

const doIt = (input: string[], mathFun: (xs: string[]) => number): number => {
  const lastOpenParenIndex = input.lastIndexOf('(');

  if (lastOpenParenIndex === -1) {
    return mathFun(input);
  }

  const correspondingClosingParens = input.indexOf(')', lastOpenParenIndex);
  const betweenParens = input.slice(
    lastOpenParenIndex + 1,
    correspondingClosingParens
  );
  const num = mathFun(betweenParens);

  const newArr = [
    ...input.slice(0, lastOpenParenIndex),
    String(num),
    ...input.slice(correspondingClosingParens + 1),
  ];

  return doIt(newArr, mathFun);
};

const parseLinePartOne = (input: string) => {
  const noSpace = input.replace(/\s/g, '');
  const arr = noSpace.split('');
  return doIt(arr, leftToRight);
};

const parseLinePartTwo = (input: string) => {
  const noSpace = input.replace(/\s/g, '');
  const arr = noSpace.split('');
  return doIt(arr, doItInWeirdOrder);
};

strictEqual(parseLinePartOne(testData), 71);
strictEqual(parseLinePartOne(testData2), 51);
strictEqual(parseLinePartOne(testData3), 437);
strictEqual(parseLinePartOne(testData4), 13632);

strictEqual(parseLinePartTwo('2 * 3 + (4 * 5)'), 46);
strictEqual(parseLinePartTwo(testData2), 51);
strictEqual(parseLinePartTwo('5 + (8 * 3 + 9 + 3 * 4 * 3)'), 1445);
strictEqual(
  parseLinePartTwo('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'),
  669060
);
strictEqual(
  parseLinePartTwo('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'),
  23340
);

const makeData = (input: string, parseLineFn: (xs: string) => number) =>
  splitMap(input, parseLineFn);

const partOne = makeData(data, parseLinePartOne).reduce((p, c) => p + c, 0);
const partTwo = makeData(data, parseLinePartTwo).reduce((p, c) => p + c, 0);
console.log({ partOne, partTwo });
