import { strictEqual } from 'assert';
import { data } from './data/6';
import { unique } from '../utils';

const getArrayOfObjects = (input: string): string[][] => {
  const splat = input.split('\n');

  const dividedStrings = splat.reduce((prev, curr) => {
    if (curr === '') {
      return [...prev, []];
    }
    const prevArr = prev[prev.length - 1] || [];
    const newNext = [...prevArr, curr.trim()].reduce(
      (p, c) => [...p, c],
      [] as string[]
    );
    prev[Math.max(prev.length - 1, 0)] = newNext;

    return prev;
  }, [] as string[][]);

  return dividedStrings;
};

const filterForAllHas = (x: string[][]) =>
  x.map((v) =>
    v.reduce((p, c) => {
      const splitCurr = c.split('');

      return unique([
        ...p,
        ...splitCurr.filter((xx) => v.every((y) => y.includes(xx))),
      ]);
    }, [] as string[])
  );

strictEqual(filterForAllHas([['abc'], ['a', 'b', 'c'], ['ab', 'ac']]), [
  ['a', 'b', 'c'],
  [],
  ['a'],
]);

const getCount = (input: string[][]) =>
  input.reduce((prev, curr) => prev + curr.length, 0 as number);

const testData = `abc

a
b
c

ab
ac

a
a
a
a

b`;

const arr = getArrayOfObjects(data);

console.log({
  count: getCount(filterForAllHas(arr)),
});
