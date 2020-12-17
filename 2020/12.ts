import { data } from './data/12';
import { strictEqual } from 'assert';
import { splitMap } from '../utils';

const parseLine = (input: string): [string, number] => {
  const [instruction, ...rest] = input;
  const num = parseInt(rest.join(''), 10);

  return [instruction, num];
};

strictEqual(parseLine('F10'), ['F', 10]);
strictEqual(parseLine('N3'), ['N', 3]);
strictEqual(parseLine('F7'), ['F', 7]);

const makeData = (input: string) => splitMap(input, parseLine);

const changeHeading = (
  currentHeading: string,
  direction: string,
  degrees: number
): string => {
  const headings = ['N', 'E', 'S', 'W'];
  const x = headings.indexOf(currentHeading);
  const turns = Math.floor(degrees / 90);
  const directedTurns = direction === 'L' ? -turns : turns;
  const newIndex = headings.length + (x + directedTurns);
  return headings[newIndex % headings.length];
};
strictEqual(changeHeading('E', 'L', 90), 'N');
strictEqual(changeHeading('N', 'L', 90), 'W');
strictEqual(changeHeading('N', 'L', 180), 'S');

const moveInDirection = (
  currentPosition: [number, number],
  instruction: ReturnType<typeof parseLine>
): [number, number] => {
  const [direction, arg] = instruction;
  const [currentEast, currentNorth] = currentPosition;
  const num = direction === 'S' || direction === 'W' ? -arg : Math.abs(arg);
  const newEast =
    currentEast + (direction === 'E' || direction === 'W' ? num : 0);
  const newNorth =
    currentNorth + (direction === 'N' || direction === 'S' ? num : 0);

  return [newEast, newNorth];
};

strictEqual(moveInDirection([0, 0], ['N', 10]), [0, 10]);
strictEqual(moveInDirection([0, 0], ['S', 10]), [0, -10]);
strictEqual(moveInDirection([0, 0], ['E', 10]), [10, 0]);
strictEqual(moveInDirection([0, 0], ['W', 10]), [-10, 0]);
strictEqual(moveInDirection([-5, -5], ['E', 10]), [5, -5]);
strictEqual(moveInDirection([-5, -5], ['N', 10]), [-5, 5]);

const rotateWaypoint = (
  waypoint: [number, number],
  direction: string,
  degrees: number
): [number, number] => {
  const [x, y] = waypoint;
  const newXHeading = changeHeading(
    Math.sign(x) === -1 ? 'W' : 'E',
    direction,
    degrees
  );
  const newYHeading = changeHeading(
    Math.sign(y) === -1 ? 'S' : 'N',
    direction,
    degrees
  );

  if (newXHeading === 'E' || newXHeading === 'W') {
    return [
      newXHeading === 'E' ? Math.abs(x) : -Math.abs(x),
      newYHeading === 'N' ? Math.abs(y) : -Math.abs(y),
    ];
  }

  return [
    newYHeading === 'E' ? Math.abs(y) : -Math.abs(y),
    newXHeading === 'N' ? Math.abs(x) : -Math.abs(x),
  ];
};

strictEqual(rotateWaypoint([10, 1], 'L', 90), [-1, 10]);
strictEqual(rotateWaypoint([-1, 10], 'L', 90), [-10, -1]);
// strictEqual(rotateWaypoint([10, 4], "R", 90), [4, -10]);
// strictEqual(rotateWaypoint([10, 4], "R", 180), [-10, -4]);
// strictEqual(rotateWaypoint([-10, -4], "R", 180), [10, 4]);
// strictEqual(rotateWaypoint([-10, -4], "R", 90), [4, 10]);
// strictEqual(rotateWaypoint([10, 4], "L", 270), [4, -10]);

const moveToWaypoint = (
  times: number,
  waypoint: [number, number],
  ferryPosition: [number, number]
): [number, number] => {
  const [ferryEast, ferryNorth] = ferryPosition;
  const [waypointEast, waypointNorth] = waypoint;
  return [ferryEast + waypointEast * times, ferryNorth + waypointNorth * times];
};

strictEqual(moveToWaypoint(11, [4, -10], [170, 38]), [214, -72]);
strictEqual(moveToWaypoint(10, [10, 1], [0, 0]), [100, 10]);
strictEqual(moveToWaypoint(7, [10, 4], [100, 10]), [170, 38]);
strictEqual(moveToWaypoint(10, [-10, -4], [100, 100]), [0, 60]);
strictEqual(moveToWaypoint(10, [-10, -4], [-100, -100]), [-200, -140]);
strictEqual(moveToWaypoint(10, [-10, -4], [100, -100]), [0, -140]);
strictEqual(moveToWaypoint(10, [-10, -4], [40, -100]), [-60, -140]);

const moveFromInstruction = (
  waypoint: [number, number],
  ferryPosition: [number, number],
  instruction: ReturnType<typeof parseLine>
): [[number, number], [number, number]] => {
  const [direction, arg] = instruction;
  switch (direction) {
    case 'N':
    case 'S':
    case 'E':
    case 'W': {
      return [moveInDirection(waypoint, instruction), ferryPosition];
    }

    case 'L':
    case 'R': {
      return [rotateWaypoint(waypoint, direction, arg), ferryPosition];
    }

    case 'F': {
      return [waypoint, moveToWaypoint(arg, waypoint, ferryPosition)];
    }
  }
  return [waypoint, ferryPosition];
};

const moveFerry = (instructions: ReturnType<typeof parseLine>[]) => {
  let currentPosition: [number, number] = [0, 0];
  let waypoint: [number, number] = [10, 1];

  for (let index = 0; index < instructions.length; index++) {
    const instruction = instructions[index];
    const [w, p] = moveFromInstruction(waypoint, currentPosition, instruction);
    waypoint = w;
    currentPosition = p;
  }
  return currentPosition;
};

const getManhattanDistance = ([x, y]: [number, number]) => {
  return Math.abs(x) + Math.abs(y);
};

strictEqual(
  moveFerry(
    makeData(`F10
L90
L90
F10`)
  ),
  [0, 0]
);

strictEqual(
  moveFerry(
    makeData(`F10
N3
F7
R90
F11`)
  ),
  [214, -72]
);
strictEqual(getManhattanDistance(moveFerry(makeData(data))), 78883);
