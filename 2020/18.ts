import { data } from './data/18';
import { strictEqual } from 'assert';
import { splitMap } from '../utils';
import _, { find, result } from 'lodash';

const testData = '1 + 2 * 3 + 4 * 5 + 6'; // 71
const testData2 = '1 + (2 * 3) + (4 * (5 + 6))'; // 51
const testData3 = '5 + (8 * 3 + 9 + 3 * 4 * 3)'; //437
const testData4 = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'; //13632

const numberRegex = /[0-9]/;

const removeSubstring = (input: string, index: number) => {
  return input.slice(0, index) + input.slice(index + 1, input.length);
};

const findAllGroups = (input: string, operators: string[]) => {
  let res = [];
  let parens = 0;
  let currentChunk = '';
  for (let index = 0; index < input.length; index++) {
    // debugger;
    const currentChar = input[index];
    if (currentChar === '(') {
      if (parens !== 0 && currentChunk !== '') {
        res.push(currentChunk);
        currentChunk = '';
      }
      parens++;
    } else if (currentChar === ')') {
      if (parens > 0) {
        res.push(currentChunk);
        currentChunk = '';
      }
      parens--;
    }
    if (parens === 0 && operators.includes(currentChar)) {
      res.push(currentChunk + currentChar);
      currentChunk = '';
    } else if (
      currentChar !== '(' &&
      currentChar !== ')' &&
      currentChar !== ' '
    ) {
      currentChunk = currentChunk + currentChar;
    }
  }
  if (currentChunk !== '') {
    res.push(currentChunk);
  }
  return res;
};

const tryEval = (input: string) => {
  try {
    return eval(input);
  } catch (error) {
    return false;
  }
};
const operators = ['+', '*'];
const parseLine = (input: string) => {
  const noSpace = input.replace(/\s/g, '');
  const arr = noSpace.split('');
  const splat = findAllGroups(input, operators)
    .filter((x) => x !== '')
    .reverse();
  debugger;
  let prev;
  let acc = 0;
  for (let index = 0; index < splat.length; index++) {
    const element = splat[index];
    debugger;
    let curr;
    if (element.length === 3) {
      const [one, operator, two] = element;
      curr =
        operator === '*'
          ? parseInt(one, 10) * parseInt(two, 10)
          : parseInt(one, 10) + parseInt(two, 10);
      if (prev) {
        acc = prev === '*' ? curr * acc : curr + acc;
      } else {
        acc = curr;
      }
    } else if (element.length === 2) {
      const [one, operator] = element;
      acc = operator === '*' ? parseInt(one) * acc : parseInt(one) + acc;
    } else if (element.length === 1) {
      prev = element;
    }
  }

  debugger;
  return acc;
};

strictEqual(parseLine(testData), 71);
// strictEqual(testData2, 51);
// strictEqual(testData3, 437);
// strictEqual(testData4, 13632);

const makeData = (input: string) => {
  return splitMap(input, parseLine);
};
