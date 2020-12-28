import { strictEqual } from 'assert';
import { data } from './data/13';

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

type Data = ReturnType<typeof makeData>;

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

strictEqual(getEarliestBus(makeData(data)), 222);

const getFirstBusTime = (
  start: number,
  increment: number,
  busTime: number,
  offset: number
): number => {
  let t = start;
  do {
    t += increment;
  } while ((t + offset) % busTime !== 0);
  return t;
};

const findEarliestTimestamp = (buses: [number, number][]): number => {
  let timestamp = 0;
  let increment = buses[0][0];
  buses.slice(1).forEach(([busTime, offset]) => {
    timestamp = getFirstBusTime(timestamp, increment, busTime, offset);
    increment *= busTime;
  });

  return timestamp;
};

strictEqual(findEarliestTimestamp(getBuses('17,x,13,19')), 3417);
strictEqual(findEarliestTimestamp(getBuses('67,7,59,61')), 754018);
strictEqual(findEarliestTimestamp(getBuses('67,x,7,59,61')), 779210);
strictEqual(findEarliestTimestamp(getBuses('67,7,x,59,61')), 1261476);
strictEqual(findEarliestTimestamp(getBuses('1789,37,47,1889')), 1202161486);
strictEqual(
  findEarliestTimestamp(getBuses(data.split('\n')[1])),
  408270049879073
);
