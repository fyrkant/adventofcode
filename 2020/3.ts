import { data } from './data/3';

const tree = '#';

const splitData: string[] = data.split('\n');

type T = { position: number; count: number };

const getResult = (rightStep: number, downStep = 1) =>
  splitData.reduce(
    (prev, currentLine, index) => {
      if (downStep !== 1 && index % 2 !== 0) {
        return prev;
      }
      const char = currentLine[prev.position % currentLine.length];
      const isTree = char === tree;
      return {
        position: prev.position + rightStep,
        count: isTree ? prev.count + 1 : prev.count,
      };
    },
    { position: 0, count: 0 } as T
  );

const bigNum = [
  getResult(1),
  getResult(3),
  getResult(5),
  getResult(7),
  getResult(1, 2),
].reduce((prev, curr) => {
  return prev * curr.count;
}, 1);

console.log(bigNum);
