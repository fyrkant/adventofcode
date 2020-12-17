import { data } from './data/16';
import { deepStrictEqual, strictEqual } from 'assert';

const parseRules = (input: string): Record<string, [string, string]> => {
  const xs = input.split('\n');
  const result: Record<string, [string, string]> = {};

  for (const line of xs) {
    const [name, nums] = line.split(': ');
    const [num1, num2] = nums.split(' or ');

    result[name] = [num1, num2];
  }

  return result;
};

const parseNums = (input: string) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const parseYourTicket = (input: string): number[] => {
  return parseNums(input.split('\n')[1]);
};

const parseOtherTickets = (input: string): number[][] => {
  return input.split('\n').slice(1).map(parseNums);
};

const makeData = (
  input: string
): {
  rules: ReturnType<typeof parseRules>;
  yours: ReturnType<typeof parseYourTicket>;
  others: ReturnType<typeof parseOtherTickets>;
} => {
  const [rules, yours, others] = input.split('\n\n');

  return {
    rules: parseRules(rules),
    yours: parseYourTicket(yours),
    others: parseOtherTickets(others),
  };
};

const testData = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;

deepStrictEqual(makeData(testData), {
  others: [
    [7, 3, 47],
    [40, 4, 50],
    [55, 2, 20],
    [38, 6, 12],
  ],
  rules: {
    class: ['1-3', '5-7'],
    row: ['6-11', '33-44'],
    seat: ['13-40', '45-50'],
  },
  yours: [7, 1, 14],
});

makeData(testData);

const isWithinRange = (range: string, num: number) => {
  const [lower, upper] = range.split('-');
  const lowerNum = parseInt(lower, 10);
  const upperNum = parseInt(upper, 10);

  const x = num >= lowerNum && num <= upperNum;

  return x;
};

const checkAgainstRules = (
  rules: Record<string, [string, string]>,
  ticketNum: number
) => {
  const rulesArr = Object.values(rules);
  for (let index = 0; index < rulesArr.length; index++) {
    const rule = rulesArr[index];
    const [lowerRange, upperRange] = rule;

    if (
      isWithinRange(lowerRange, ticketNum) ||
      isWithinRange(upperRange, ticketNum)
    ) {
      return true;
    }
  }
  return false;
};

const getInvalidNumbers = (d: ReturnType<typeof makeData>) => {
  const { others, rules } = d;
  const result: number[] = [];
  const cache = new Map<number, boolean>();
  for (let index = 0; index < others.length; index++) {
    const ticketNums = others[index];

    for (let ii = 0; ii < ticketNums.length; ii++) {
      const num = ticketNums[ii];
      const cached = cache.get(num);
      if (typeof cached !== 'undefined') {
        if (!cached) {
          result.push(num);
        }
      } else {
        const matchesRule = checkAgainstRules(rules, num);
        cache.set(num, matchesRule);
        if (!matchesRule) {
          result.push(num);
        }
      }
    }
  }
  return result;
};
const filterOutInvalid = (
  d: ReturnType<typeof makeData>
): ReturnType<typeof makeData> => {
  const { others, rules, yours } = d;
  const result: number[] = [];
  const invalidCache = new Set<number>();

  const filteredOthers = others.filter((ticketNums) => {
    return ticketNums.reduce((p, num) => {
      if (!p) {
        return false;
      }
      const cachedInvalid = invalidCache.has(num);

      if (!cachedInvalid) {
        if (!checkAgainstRules(rules, num)) {
          invalidCache.add(num);
          return false;
        }
      } else {
        return false;
      }
      return true;
    }, true as boolean);
  });
  return { yours, rules, others: filteredOthers };
};

strictEqual(
  getInvalidNumbers(makeData(testData)).reduce((p, c) => p + c, 0),
  71
);
strictEqual(
  getInvalidNumbers(makeData(data)).reduce((p, c) => p + c, 0),
  27911
);

const matchesAllValuesOfIndex = (
  rule: [string, string],
  tickets: number[][],
  index: number
) => {
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    const num = ticket[index];

    const [lowerRange, upperRange] = rule;

    if (!isWithinRange(lowerRange, num) && !isWithinRange(upperRange, num)) {
      return false;
    }
  }
  return true;
};

const findRealIndices = (record: Record<string, number[]>) => {
  let entries = Object.entries(record);
  let finalEntries: [string, number[]][] = [];
  while (true) {
    const single = entries.find(([, val]) => val.length === 1);
    if (!single) {
      return finalEntries.reduce((p, [key, val]) => {
        return { ...p, [key]: val };
      }, {});
    }
    finalEntries.push(single);
    entries = entries.map(([key, val]) => {
      return [key, val.filter((x) => x !== single[1][0])];
    });
  }
};

const findFieldIndices = (
  input: ReturnType<typeof makeData>
): Record<string, number[]> => {
  const { rules, others, yours } = input;

  const allTickets = others; //.concat([yours]);
  const ticketLength = allTickets[0].length;

  const result: Record<string, number[]> = {};

  Object.entries(rules).forEach(([key, rule]) => {
    for (let index = 0; index < ticketLength; index++) {
      if (matchesAllValuesOfIndex(rule, allTickets, index)) {
        const prev = result[key] || [];
        result[key] = prev.concat(index);
      }
    }
  });

  return findRealIndices(result);
};

// const d1 = filterOutInvalid(
//   makeData(`class: 0-1 or 4-19
// row: 0-5 or 8-19
// seat: 0-13 or 16-19

// your ticket:
// 11,12,13

// nearby tickets:
// 3,9,18
// 15,1,5
// 5,14,9`)
// );
// console.log(findFieldIndices(d1));
const d2 = filterOutInvalid(makeData(data));
console.log(
  Object.entries(findFieldIndices(d2)).reduce((p, [key, val]) => {
    if (key.startsWith('departure')) {
      return p * d2.yours[val[0]];
    }
    return p;
  }, 1)
);
