import { dataString } from './data/05';
import { strictEqual } from 'assert';

const testData = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

const handleData = (
  input: string
): { start: [number, number]; end: [number, number] }[] => {
  return input.split('\n').map((v) => {
    const [start, end] = v.split(' -> ');
    const [sx, sy] = start.split(',').map((v) => parseInt(v));
    const [ex, ey] = end.split(',').map((v) => parseInt(v));

    return { start: [sx, sy], end: [ex, ey] };
  });
};

const findPoints = (d: ReturnType<typeof handleData>): number => {
  const map = new Map<string, number>();

  d.forEach(({ start, end }) => {
    const [x1, y1] = start;
    const [x2, y2] = end;

    if (x1 === x2) {
      const min = Math.min(y1, y2);
      const max = Math.max(y1, y2);
      for (let index = min; index <= max; index++) {
        const k = `${x1},${index}`;
        const prev = map.get(k) || 0;
        map.set(k, prev + 1);
      }
    } else if (y1 === y2) {
      const min = Math.min(x1, x2);
      const max = Math.max(x1, x2);
      for (let index = min; index <= max; index++) {
        const k = `${index},${y1}`;
        const prev = map.get(k) || 0;
        map.set(k, prev + 1);
      }
    } else {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const hej = maxX - minX;
      const startY = minX === x1 ? y1 : y2;
      const endY = startY === y1 ? y2 : y1;
      debugger;
      for (let index = 0; index <= hej; index++) {
        const yToUse = startY + (startY < endY ? index : -index);
        const k = `${minX + index},${yToUse}`;
        const prev = map.get(k) || 0;
        map.set(k, prev + 1);
      }
    }
  });

  return Array.from(map.values()).filter((v) => v > 1).length;
};

const td = handleData(testData);
const d = handleData(dataString);
console.log(findPoints(d));
