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

const play = (p1Card: number, p2Card: number) => {
  if (p1Card > p2Card) {
  }
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
  const countScore = (cards: number[]) => {
    return cards.reverse().reduce((p, c, i) => {
      return p + c * (i + 1);
    }, 0);
  };
  const score = countScore(winningCards);
  return score;
};

const data = makeData(dataString);

strictEqual(runGame(testData), 306);
strictEqual(runGame(data), 31269);

debugger;
