import { dataString } from './data/13.ts';
// import { strictEqual } from 'assert';

const testData = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

const handleData = (
  input: string
): { dots: [x: number, y: number][]; folds: ['y' | 'x', number][] } => {
  const [ds, fs] = input.split('\n\n');

  const dots = ds.split('\n').map((l) => {
    const [x, y] = l.split(',');

    return [parseInt(x, 10), parseInt(y, 10)] as [number, number];
  });

  const folds = fs.split('\n').map((l) => {
    const [x, n] = l.split('=');

    return [x.endsWith('x') ? 'x' : 'y', parseInt(n, 10)] as [
      'x' | 'y',
      number
    ];
  });

  return { dots, folds };
};

const partOne = (input: ReturnType<typeof handleData>): number => {
  const set = new Set<string>();
  console.log(input);
  let folded: typeof input.dots = [...input.dots];
  // const [axis, num] = input.folds[0];
  input.folds.forEach(([axis, num]) => {
    folded = folded.map(([x, y]) => {
      if (axis === 'x') {
        if (x > num) {
          return [Math.abs(x - num * 2), y];
        }
      } else {
        if (y > num) {
          return [x, Math.abs(y - num * 2)];
        }
      }

      return [x, y];
    });
  });

  folded.forEach(([x, y]) => set.add(`${x},${y}`));

  const maxX = folded.slice().sort((a, b) => b[0] - a[0])[0];
  const maxY = folded.slice().sort((a, b) => b[1] - a[1])[0];

  const ar: string[][] = [];
  for (let xi = 0; xi <= maxX[0]; xi++) {
    const a: string[] = [];
    for (let yi = 0; yi <= maxY[1]; yi++) {
      if (set.has(`${xi},${yi}`)) {
        a.push('X');
      } else {
        a.push('\u00a0');
      }
    }
    ar.push(a);
  }
  console.log(ar.map((l) => l.join('')).join('\n'));

  console.log(maxX, maxY);

  return set.size;
};

const td = handleData(testData);
// const td = handleData(testData);
const d = handleData(dataString);

console.log(partOne(td));
console.log(partOne(d));
