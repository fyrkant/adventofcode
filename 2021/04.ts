import { dataString } from './data/04';
import { strictEqual } from 'assert';

const testData = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

type Board = { lines: number[][]; rows: number[][] };

const handleData = (i: string): { draws: number[]; boards: Board[] } => {
  const [drawsString, ...boardsStrings] = i.split('\n\n');

  const draws = drawsString.split(',').map((v) => parseInt(v, 10));
  const boards = boardsStrings.map((b) => {
    const lines = b.split('\n').map((l) => {
      return l
        .trim()
        .split(' ')
        .map((v) => parseInt(v, 10))
        .filter((x) => !isNaN(x));
    });
    const rows: number[][] = [];
    lines.forEach((line) => {
      line.forEach((l, i) => {
        rows[i] = [...(rows[i] || []), l];
      });
    });

    console.log({ lines }, { rows });

    return { lines, rows };
  });

  return { draws, boards };
};

const d = handleData(testData);

const checkBoard = (board: Board, draws: number[]) => {
  for (let index = 0; index < board.lines.length; index++) {
    const line = board.lines[index];

    if (line.every((e) => draws.includes(e))) {
      const unPicked = board.lines
        .flat()
        .filter((e) => !draws.includes(e))
        .reduce((p, c) => p + c, 0);

      return draws[draws.length - 1] * unPicked;
    }
  }
  for (let index = 0; index < board.rows.length; index++) {
    const row = board.rows[index];

    if (row.every((e) => draws.includes(e))) {
      const unPicked = board.rows
        .flat()
        .filter((e) => !draws.includes(e))
        .reduce((p, c) => p + c, 0);

      return draws[draws.length - 1] * unPicked;
    }
  }
  return false;
};

const play = (input: ReturnType<typeof handleData>) => {
  let { draws, boards } = input;

  console.log({ draws, boards });

  for (let index = 0; index < draws.length; index++) {
    const drawing = draws.slice(0, index + 1);

    console.log(drawing);

    for (let j = 0; j < boards.length; j++) {
      const board = boards[j];
      const check = checkBoard(board, drawing);

      console.log({ check });

      if (check && boards.length === 1) {
        return check;
      } else if (check) {
        boards.splice(j, 1);
      }
    }
  }
};

console.log(play(d));
console.log(play(handleData(dataString)));
