import { strictEqual } from 'assert';
import { data } from './data/13';

import { splitMap } from '../utils';

const parseLine = (input: string) => {
  return parseInt(input, 10);
};

const makeData = (input: string): [number, number[]] => {
  const [t, rest] = input.split('\n');

  const earliest = parseInt(t, 10);
  const buses = rest
    .split(',')
    .filter((x) => x !== 'x')
    .map(parseLine);
  return [earliest, buses];
};

const getBuses = (input: string): [number, number][] => {
  const arr = input.split(',');
  const ret = [];
  for (let index = 0; index < arr.length; index++) {
    const id = arr[index];
    if (id !== 'x') {
      const x: [number, number] = [parseInt(id, 10), index];
      ret.push(x);
    }
  }

  return ret;
};

// strictEqual(getBuses("17,x,13,19"), [[17, 0], [13, 2], [19, 3]]);

type Data = ReturnType<typeof makeData>;

const testData = `939
7,13,x,x,59,x,31,19`;

// strictEqual(
//   makeData(testData),
//   [939, [7, 13, 59, 31, 19]],
// );

const getEarliestBus = (input: Data) => {
  const [departure, buses] = input;
  let nearestBusDeparture = Infinity;
  let nearestBusId = null;
  for (let index = 0; index < buses.length; index++) {
    const busId = buses[index];
    const busDepartureTimes = Math.ceil(departure / busId);
    const busDepartureTime = busId * busDepartureTimes;
    if (
      busDepartureTime > departure &&
      busDepartureTime < nearestBusDeparture
    ) {
      nearestBusDeparture = busDepartureTime;
      nearestBusId = busId;
    }
  }

  if (nearestBusId) {
    const waitTime = nearestBusDeparture - departure;

    return nearestBusId * waitTime;
  }
};

// strictEqual(getEarliestBus(makeData(testData)), 295);
strictEqual(getEarliestBus(makeData(data)), 222);

const allMatch = (
  timestamp: number,
  os: number,
  buses: ReturnType<typeof getBuses>
): boolean => {
  for (let index = 0; index < buses.length; index++) {
    const [id, offset] = buses[index];
    if ((timestamp + offset - os) % id === 0) {
      return false;
    }
  }
  return true;
  // return buses.every(([id, offset]) => (timestamp + offset - os) % id === 0);
};

const doAllMatch = (os: number, buses: ReturnType<typeof getBuses>) => (
  timestamp: number
): boolean => {
  const strs = [];
  for (let index = 0; index < buses.length; index++) {
    const [id, offset] = buses[index];
    strs.push(`(timestamp + ${offset} - ${os}) % ${id} === 0`);
    // if ((timestamp + offset - os) % id === 0) {
    //   return false;
    // }
  }
  console.log(strs.join(''));
  return true;
  // return buses.every(([id, offset]) => (timestamp + offset - os) % id === 0);
};

const nextTick = () => {
  return new Promise<void>((res) => process.nextTick(() => res()));
};

const findEarliestTimestamp = (start: number): number => {
  const initial = 29;
  console.log({ initial });
  let timestamp = start;
  let count = 0;
  while (true) {
    count++;
    // if (count > 1000000000) {
    //   console.log('OVER!!!!', { timestamp: timestamp - initial[1], count });
    //   return timestamp;
    // }
    if (count % 1000000000 === 0) {
      // console.log(`    timestamp: ${timestamp} count: ${count}\r`);
      process.stdout.write(`    timestamp: ${timestamp} count: ${count}\r`);
    }
    if (
      (timestamp + 0) % 29 === 0 &&
      (timestamp + 23) % 37 === 0 &&
      (timestamp + 29) % 409 === 0 &&
      (timestamp + 46) % 17 === 0 &&
      (timestamp + 47) % 13 === 0 &&
      (timestamp + 48) % 19 === 0 &&
      (timestamp + 52) % 23 === 0 &&
      (timestamp + 60) % 353 === 0 &&
      (timestamp + 101) % 41 === 0
    ) {
      console.log('WOW!!!', { timestamp: timestamp - initial, count });
      return timestamp - initial;
    }
    timestamp += initial;
  }
};

const doFindEarliest = (start?: number) => {
  debugger;

  return findEarliestTimestamp(start || 29);
};
const run = () => {
  // strictEqual(await doFindEarliest('17,x,13,19'), 3417);
  // strictEqual(await doFindEarliest('67,7,59,61'), 754018);
  // strictEqual(await doFindEarliest('67,x,7,59,61'), 779210);
  // strictEqual(await doFindEarliest('67,7,x,59,61'), 1261476);
  // strictEqual(await doFindEarliest('1789,37,47,1889'), 1202161486);
  // strictEqual(doFindEarliest(data.split("\n")[1], 100000000000000), 1202161486);

  const x = doFindEarliest(99999999999971);
  console.log(x);
};

run();
// strictEqual(findEarliestTimestamp(29000000000, getBuses(data)), 123);
