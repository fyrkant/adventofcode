import { data } from "./data/13.ts";
import { assertEquals } from "../assert.bundle.js";
import { splitMap } from "../utils.ts";

const parseLine = (input: string) => {
  return parseInt(input, 10);
};

const makeData = (input: string): [number, number[]] => {
  const [t, rest] = input.split("\n");

  const earliest = parseInt(t, 10);
  const buses = rest.split(",").filter((x) => x !== "x").map(parseLine);
  return [earliest, buses];
};

const getBuses = (input: string): [number, number][] => {
  const arr = input.split(",");
  const ret = [];
  for (let index = 0; index < arr.length; index++) {
    const id = arr[index];
    if (id !== "x") {
      const x: [number, number] = [parseInt(id, 10), index];
      ret.push(x);
    }
  }

  return ret;
};

assertEquals(getBuses("17,x,13,19"), [[17, 0], [13, 2], [19, 3]]);

type Data = ReturnType<typeof makeData>;

const testData = `939
7,13,x,x,59,x,31,19`;

assertEquals(
  makeData(testData),
  [939, [7, 13, 59, 31, 19]],
);

const getEarliestBus = (input: Data) => {
  const [departure, buses] = input;
  let nearestBusDeparture = Infinity;
  let nearestBusId = null;
  for (let index = 0; index < buses.length; index++) {
    const busId = buses[index];
    const busDepartureTimes = Math.ceil(departure / busId);
    const busDepartureTime = busId * busDepartureTimes;
    if (
      busDepartureTime > departure && busDepartureTime < nearestBusDeparture
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

assertEquals(getEarliestBus(makeData(testData)), 295);
// assertEquals(getEarliestBus(makeData(data)), 222);

const allMatch = (timestamp: number, buses: ReturnType<typeof getBuses>) => {
  return !buses.some(([id, offset]) => (timestamp + offset) % id !== 0);
};

const findEarliestTimestamp = (
  start: number,
  buses: ReturnType<typeof getBuses>,
): number => {
  let timestamp = start;
  while (true) {
    // console.log(timestamp);
    if (allMatch(timestamp, buses)) {
      return timestamp;
    } else {
      timestamp = timestamp + buses[0][0];
    }
  }
};

const doFindEarliest = (input: string) => {
  const d = getBuses(input);
  const first = d[0][0];
  let x = 0;
  for (let index = first; !allMatch(index, d); index = index + first) {
    // console.log(index);
    x = index;
  }
  return x + first;
  // return findEarliestTimestamp(d[0][0], d);
};

assertEquals(doFindEarliest("17,x,13,19"), 3417);
// assertEquals(doFindEarliest("67,7,59,61"), 754018);
// assertEquals(doFindEarliest("67,x,7,59,61"), 779210);
// assertEquals(doFindEarliest("67,7,x,59,61"), 1261476);
assertEquals(doFindEarliest("1789,37,47,1889"), 1202161486);
// assertEquals(doFindEarliest(data), 1202161486);
// assertEquals(findEarliestTimestamp(29000000000, getBuses(data)), 123);
