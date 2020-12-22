import { strictEqual } from 'assert';
import { dataString } from './data/22';
import * as R from 'remeda';

const testDataString = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

const parsePlayerCards = (input: string): number[] => {
  const [, ...cards] = input.split('\n');
  return cards.map((x) => parseInt(x, 10));
};

type Data = { playerOne: number[]; playerTwo: number[] };
const makeData = (input: string): Data => {
  const [p1, p2] = input.split('\n\n');

  return { playerOne: parsePlayerCards(p1), playerTwo: parsePlayerCards(p2) };
};

const testData = makeData(testDataString);

const countScore = (cards: number[]) => {
  return cards.reverse().reduce((p, c, i) => {
    return p + c * (i + 1);
  }, 0);
};

const runGame = (d: Data) => {
  let round = 0;
  const playerOneCards = R.clone(d.playerOne);
  const playerTwoCards = R.clone(d.playerTwo);
  do {
    round++;
    const playerOneCard = playerOneCards.shift();
    const playerTwoCard = playerTwoCards.shift();
    if (!playerOneCard || !playerTwoCard) return;
    // debugger;
    if (playerOneCard > playerTwoCard) {
      playerOneCards.push(playerOneCard, playerTwoCard);
    } else {
      playerTwoCards.push(playerTwoCard, playerOneCard);
    }
  } while (playerOneCards.length > 0 && playerTwoCards.length > 0);
  const winningCards =
    playerOneCards.length > 0 ? playerOneCards : playerTwoCards;
  const score = countScore(winningCards);
  return score;
};

const data = makeData(dataString);

// strictEqual(runGame(testData), 306);
// strictEqual(runGame(data), 31269);

const runGameTwo = (poc: number[], ptc: number[]): [number[], number[]] => {
  const prevPlays: [p1: number[], p2: number[]][] = [];
  let round = 0;
  const playerOneCards = poc;
  const playerTwoCards = ptc;

  do {
    // debugger;
    round++;
    const prevPlay = prevPlays.find(([p1, p2]) => {
      return R.equals(playerOneCards, p1) || R.equals(playerTwoCards, p2);
    });
    if (prevPlay) {
      // console.log(`PREV PLAY! player one wins round ${round}`);
      return [[1], []];
    }
    prevPlays.push([playerOneCards.slice(), playerTwoCards.slice()]);
    const playerOneCard = playerOneCards.shift();
    const playerTwoCard = playerTwoCards.shift();
    if (!playerOneCard || !playerTwoCard) return [[], []];

    if (
      playerOneCards.length < playerOneCard ||
      playerTwoCards.length < playerTwoCard
    ) {
      if (playerOneCard > playerTwoCard) {
        // console.log(`player one wins round ${round}`);
        playerOneCards.push(playerOneCard, playerTwoCard);
      } else {
        // console.log(`player two wins round ${round}`);
        playerTwoCards.push(playerTwoCard, playerOneCard);
      }
    } else {
      debugger;
      const [p1sub] = runGameTwo(
        playerOneCards.slice(0, playerOneCard),
        playerTwoCards.slice(0, playerTwoCard)
      );
      if (p1sub.length > 0) {
        // console.log(`SUB GAME! player one wins round ${round}`);

        playerOneCards.push(playerOneCard, playerTwoCard);
      } else {
        // console.log(`SUB GAME! player one wins round ${round}`);

        playerTwoCards.push(playerTwoCard, playerOneCard);
      }
      debugger;
    }
  } while (playerOneCards.length > 0 && playerTwoCards.length > 0);

  return [playerOneCards, playerTwoCards];
};

// const cache = new Map<string, [number[], number[]]>();
// const memoizedGameTwo = (
//   poc: number[],
//   ptc: number[]
// ): [number[], number[]] => {
//   const s = poc.join('') + ptc.join('');
//   // console.log(s);
//   const cached = cache.get(s);
//   if (cached) {
//     console.log('cached returned');
//     return cached;
//   } else {
//     const r = runGameTwo(poc, ptc);
//     cache.set(s, r);
//     return r;
//   }
// };

// const loopData = makeData(loopingTestString);

const runAndCount = (d: Data) => {
  const [p1, p2] = runGameTwo(d.playerOne, d.playerTwo);

  console.log(p1, p2);
  console.log(countScore(p1.length > 0 ? p1 : p2));
};

runAndCount(data);

debugger;
