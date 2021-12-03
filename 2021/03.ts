import { dataString } from './data/03';
import { strictEqual, deepEqual } from 'assert';

const splitData = (i: string): (1 | 0)[][] => {
  return i
    .split('\n')
    .map((s) => s.split('').map((is) => (is === '0' ? 0 : 1)));
};

const testData = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

const getGammaAndEpsilon = (
  input: ReturnType<typeof splitData>
): [number, number, number] => {
  const counts: { 0: number; 1: number }[] = [];

  input.forEach((v) => {
    v.forEach((iv, i) => {
      if (!counts[i]) {
        counts[i] = { 0: 0, 1: 0 };
      }
      counts[i][iv] = counts[i][iv] + 1;
    });
  });

  let gamma = '';
  let epsilon = '';

  counts.forEach((c) => {
    gamma = `${gamma}${c[0] > c[1] ? '0' : '1'}`;
    epsilon = `${epsilon}${c[0] < c[1] ? '0' : '1'}`;
  });

  return [
    parseInt(gamma, 2),
    parseInt(epsilon, 2),
    parseInt(gamma, 2) * parseInt(epsilon, 2),
  ];
};

const hej = (xs: (1 | 0)[][], i: number, o2: boolean): any => {
  if (xs.length === 1) {
    return parseInt(xs[0].join(''), 2);
  }

  const counts = { 0: 0, 1: 0 };

  xs.forEach((v) => {
    counts[v[i]] = counts[v[i]] + 1;
  });

  const newXs = xs.filter(
    (v) =>
      v[i] === ((o2 ? counts[0] > counts[1] : counts[0] <= counts[1]) ? 0 : 1)
  );

  return hej(newXs, i + 1, o2);
};

const getOxygenAndScrubber = (xs: (1 | 0)[][]): [number, number, number] => {
  const [a, b] = [hej(xs, 0, true), hej(xs, 0, false)];
  return [a, b, a * b];
};

const d = splitData(testData);

// console.log(hej(d, 0, false))

deepEqual(getGammaAndEpsilon(d), [22, 9, 198]);
deepEqual(getOxygenAndScrubber(d), [23, 10, 230]);
deepEqual(getGammaAndEpsilon(splitData(dataString)), [1869, 2226, 4160394]);
deepEqual(getOxygenAndScrubber(splitData(dataString)), [1719, 2400, 4125600]);
