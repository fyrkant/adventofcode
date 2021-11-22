import { strictEqual } from 'assert';
import _ from 'lodash';
import { data } from './data/19';

const testDataString = `5: "b"
0: 4 1 5
4: "a"
2: 4 4 | 5 5
3: 4 5 | 5 4
1: 2 3 | 3 2

ababbb
bababa
abbbab
aaabbb
aaaabbb`;

const addStringToAll = (s: string, xs: string[]) => {
  return xs.length > 0 ? xs.map((x) => x + s) : xs.concat(s);
};
const addAtIndex = (s: string, xs: string[][], i: number) => {
  const e = xs[i];
  xs[i] = addStringToAll(s, e || []);

  return xs;
};
const appendAtIndex = (s: string, xs: string[][], i: number) => {
  const e = xs[i] || [];
  xs[i] = addStringToAll(s, e || []);

  return xs;
};

const compileRule = (
  r: string,
  rulesMap: Map<number, string>,
  aIndex: number,
  bIndex: number
): string[] => {
  const ruleParts = r.split(' | ');
  debugger;
  const compiledMap = new Map<number, string[]>();
  const compiledRules: string[][] = [];
  for (let partIndex = 0; partIndex < ruleParts.length; partIndex++) {
    const x = '';
    const part = ruleParts[partIndex];
    const rules = part.split(' ');
    for (let i = 0; i < rules.length; i++) {
      const element = parseInt(rules[i], 10);
      if (element === aIndex) {
        addAtIndex('a', compiledRules, partIndex);
      } else if (element === bIndex) {
        addAtIndex('b', compiledRules, partIndex);
      } else {
        const nestedRule = rulesMap.get(element);
        if (nestedRule) {
          const y = compileRule(nestedRule, rulesMap, aIndex, bIndex);
          debugger;
          y.forEach((v) => {
            addAtIndex(v, compiledRules, partIndex);
          });
        }
      }
    }
  }
  debugger;
  const ret: string[] = [];
  for (let ii = 0; ii < compiledRules.length; ii++) {
    const rule = compiledRules[ii];
    rule.forEach((r) => {
      // ret.
    });
  }
  return _.flatten(compiledRules);
};

const splitRule = (input: string) => {
  const [index, rule] = input.split('');
};

const doWitWithTheArrayThing = (xs: [string, string][]): [string, string][] => {
  let x: typeof xs = [];

  xs.forEach(([n, r]) => {
    const reg = new RegExp(n, 'g');
    // debugger;
    x = xs.map(([n, l]) => {
      return [n, l.replace(reg, `(${r})`)];
    });
  });

  return x;
};

const hello = (input: [string, string][]) => {};

const getAB = (m: Map<string, string[][]>): [string, string] => {
  let a = '';
  let b = '';
  for (const x of m) {
    const [k, v] = x;
    if (v[0][0] === '"a"') {
      a = k;
    }
    if (v[0][0] === '"b"') {
      b = k;
    }
    if (a && b) {
      return [a, b];
    }
  }
  return [a, b];
};

const parseRules = (input: string) => {
  const map = new Map<string, string[][]>();
  input.split('\n').forEach((l) => {
    const [n, r] = l.split(':');

    const rArr = r
      .split('|')
      .map((num) => num.split(' ').filter((x) => x !== ''));
    map.set(n, rArr);
  });

  const [a, b] = getAB(map);

  for (const x of map) {
    const [k, v] = x;

    const newV = v.map((i) => {
      debugger;
      return i.map((y) => {
        if (y === a) {
          return '"a"';
        } else if (y === b) {
          return '"b"';
        } else {
          return map.get(y);
        }
      });
    });
    map.set(k, newV);
  }
  debugger;
  // array.forEach(([n, r]) => {
  //   const reg = new RegExp(n, 'g');
  //   // debugger;
  //   array = array.map(([n, l]) => {
  //     return [n, l.replace(reg, `(${r})`)];
  //   });
  // });
  // debugger;
  // array.forEach(([n, r]) => {
  //   const reg = new RegExp(n, 'g');
  //   // debugger;
  //   array = array.map(([n, l]) => {
  //     console.log({ n, l });
  //     return [n, l.replace(reg, `(${r})`)];
  //   });
  // });
  // debugger;
  // array = array.map(([n, r]) => [n, r.replace(/\s/g, '').replace(/"/g, '')]);
  // const zero = array[0];

  // return zero ? new RegExp(`^${zero[1]}$`) : false;
  // let rules = new Map<number, string>();

  // for (let index = 0; index < array.length; index++) {
  //   const line = array[index];
  //   const [num, rule] = line.split(': ');
  //   const numIndex = parseInt(num, 10);
  //   if (rule === '"a"') {
  //     aIndex = numIndex;
  //   } else if (rule === '"b"') {
  //     bIndex = numIndex;
  //   }
  //   rules.set(numIndex, rule);
  // }

  // const ruleZero = rules.get(0);
  // if (!ruleZero) {
  //   return [];
  // }
  // const x = compileRule(ruleZero, rules, aIndex, bIndex);
  // debugger;
};

const makeData = (input: string) => {
  const [rulesString, messagesString] = input.split('\n\n');
  const ruleRegex = parseRules(rulesString);
  debugger;
  if (!ruleRegex) {
    console.log('nope');
    return;
  }
  const messages = messagesString.split('\n').filter((x) => ruleRegex.test(x));
  console.log(messages.length);
};

// const testD = makeData(testDataString);
const testD2 = makeData(data);
