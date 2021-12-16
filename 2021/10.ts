import { dataString } from './data/10.ts';
import { assertEquals } from 'https://deno.land/std@0.117.0/testing/asserts.ts';

const testData = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

const splitLine = (s: string): string[] => {
  return s.split('');
};

const handleData = (s: string): string[][] => {
  return s.split('\n').map((x) => splitLine(x));
};

const flipClose = (close: string): string => {
  switch (close) {
    case '}':
      return '{';
    case ']':
      return '[';
    case ')':
      return '(';
    case '>':
      return '<';

    default:
      return '';
  }
};

const flipOpen = (x: string) => {
  switch (x) {
    case '<':
      return '>';
    case '(':
      return ')';
    case '{':
      return '}';
    case '[':
      return ']';
    default:
      return x;
  }
};

const handleLine = (input: string[]): string | string[] => {
  const arr = input.slice();

  while (true) {
    const firstCloseIndex = arr.findIndex((x) => {
      return ['>', ')', '}', ']'].includes(x);
    });

    if (firstCloseIndex === -1) {
      return arr.reverse().map((x) => flipOpen(x));
    }

    const close = arr[firstCloseIndex];
    const open = flipClose(close);

    const closestOpenIndex = arr
      .slice(0, firstCloseIndex + 1)
      .findLastIndex((x) => {
        return ['<', '(', '{', '['].includes(x);
      });

    const actualOpen = arr[closestOpenIndex];

    if (open !== actualOpen) {
      return close;
    } else {
      arr.splice(firstCloseIndex, 1);
      arr.splice(closestOpenIndex, 1);
    }
  }
};

assertEquals(handleLine(splitLine('{([(<{}[<>[]}>{[]{[(<()>')), '}');
assertEquals(
  handleLine(splitLine('[({(<(())[]>[[{[]{<()<>>')),
  '}}]])})]'.split('')
);

const partOne = (input: string[][]): number => {
  return input
    .map((line) => {
      const x = handleLine(line);
      return x;
    })
    .filter((x) => !Array.isArray(x))
    .map((x) => {
      /*
        ): 3 points.
        ]: 57 points.
        }: 1197 points.
        >: 25137 points.
      */
      switch (x) {
        case '}':
          return 1197;
        case ']':
          return 57;
        case ')':
          return 3;
        case '>':
          return 25137;
        default:
          return 1;
      }
    })
    .reduce((p, x) => p + x, 0 as number);
};

const partTwo = (input: string[][]): number => {
  const incompleteLines: string[][] = input
    .map((line) => handleLine(line))
    .filter((x) => {
      return Array.isArray(x);
    }) as string[][];

  return incompleteLines
    .map((completed) => {
      return completed.reduce((p, e) => {
        /*
          ): 1 point.
          ]: 2 points.
          }: 3 points.
          >: 4 points.
        */

        switch (e) {
          case '}':
            return p * 5 + 3;
          case ']':
            return p * 5 + 2;
          case ')':
            return p * 5 + 1;
          case '>':
            return p * 5 + 4;
          default:
            return p;
        }
      }, 0);
    })
    .sort((a, b) => a - b)[Math.round((incompleteLines.length - 1) / 2)];
};

// const td = handleData(testData);
const d = handleData(dataString);

console.log(partOne(d));
console.log(partTwo(d));
