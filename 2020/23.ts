import { splitMap } from '../utils';
import * as R from 'remeda';

const testDataString = `389125467`;

const makeData = (input: string) => splitMap(input, (x) => parseInt(x, 10), '');

const findDestinationLabel = (
  pickedLabels: number[],
  start: number,
  min: number,
  max: number
) => {
  let current = start;
  while (true) {
    if (current < min) {
      current = max;
    }
    if (!pickedLabels.includes(current)) {
      return current;
    } else {
      current = current - 1;
    }
  }
};

const getMinMax = (
  startMin: number,
  startMax: number,
  pickedValues: number[]
) => {
  let min = startMin;
  let max = startMax;
  while (pickedValues.includes(min)) {
    min++;
  }
  while (pickedValues.includes(max)) {
    max--;
  }
  return [min, max];
};

type CupNode = { label: number; next: number };

const runGameCircularList = (input: number[], moves: number) => {
  const cups = new Map<number, CupNode>();

  input.forEach((label, i) => {
    const maybeNext = input[i + 1];

    let next = maybeNext ? maybeNext : input[0];
    cups.set(label, { label, next });
  });
  let currentCup = cups.get(input[0]);

  for (let move = 0; move < moves; move++) {
    if (!currentCup) {
      return;
    }
    const pickedCups: CupNode[] = [];
    for (let pickedNum = 0; pickedCups.length < 3; pickedNum++) {
      if (pickedCups.length === 0) {
        const next = cups.get(currentCup.next);
        if (!next) return;
        pickedCups.push(next);
      } else {
        const next = cups.get(pickedCups[pickedCups.length - 1].next);
        if (!next) return;
        pickedCups.push(next);
      }
    }
    const pickedCupLabels = pickedCups.map(R.prop('label'));
    const firstPickedCup = pickedCups[0];
    const lastPickedCup = pickedCups[2];
    currentCup.next = lastPickedCup.next;
    const [min, max] = getMinMax(1, input.length, pickedCupLabels);
    const destinationStart = currentCup.label - 1;
    const destinationLabel = findDestinationLabel(
      pickedCupLabels,
      destinationStart,
      min,
      max
    );
    const destinationCup = cups.get(destinationLabel);
    debugger;
    if (!destinationCup) {
      return;
    }

    lastPickedCup.next = destinationCup.next;
    destinationCup.next = firstPickedCup.label;

    const nextCup = cups.get(currentCup.next);
    if (!nextCup) {
      return;
    }
    currentCup = nextCup;
  }
  const oneCup = cups.get(1);
  if (!oneCup) {
    return;
  }
  let nextCup = cups.get(oneCup.next);
  if (!nextCup) {
    return;
  }

  let str = '';
  let next = cups.get(oneCup.next);
  for (let index = 0; index < 8; index++) {
    if (next) {
      str = str + next.label;
      next = cups.get(next.next);
    }
  }
  console.log({ str });

  return [nextCup.label, nextCup.next];
};

const makeBigData = (nums: number[], end: number) => {
  const sortedList = R.sort(nums, (a, b) => a - b);
  const highestValue = sortedList[sortedList.length - 1];
  const rest = R.range(highestValue + 1, end + 1);

  return nums.concat(rest);
};

const testData = makeData(testDataString);
const data = makeData('784235916');
const bigData = makeBigData(data, 1000000);
const bigTestData = makeBigData(testData, 1000000);
// debugger;

// strictEqual(runGameCircularList(testData, 10), '92658374');
console.log(runGameCircularList(bigData, 10000000)?.reduce((p, c) => p * c, 1));
// strictEqual(runGame(testData, 100), '67384529');
// strictEqual(runGame(data, 100), '53248976');
