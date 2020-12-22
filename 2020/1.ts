import { data } from './data/1';

const result = data.reduce((prev: undefined | number, cur, index) => {
  if (typeof prev !== 'undefined') {
    return prev;
  }

  const slicedData = [...data.slice(0, index), ...data.slice(index + 1)];

  const match = slicedData.reduce(
    (innerPrev: undefined | number, innerCur, innerIndex) => {
      if (typeof innerPrev !== 'undefined') {
        return innerPrev;
      }
      const third = [
        ...slicedData.slice(0, innerIndex),
        ...slicedData.slice(innerIndex + 1),
      ];
      return third.reduce((p: undefined | number, c) => {
        if (typeof p !== 'undefined') {
          return p;
        }
        const sum = cur + innerCur + c;
        if (sum === 2020) {
          return cur * innerCur * c;
        }
        return undefined;
      }, undefined);
    },
    undefined
  );

  return match;
}, undefined);

console.log(result);
