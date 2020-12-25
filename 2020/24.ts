import { dataString } from './data/24';
import { strictEqual } from 'assert';
import { splitMap } from '../utils';
import * as R from 'remeda';

type Direction = 'e' | 'se' | 'sw' | 'w' | 'nw' | 'ne';

const parseLine = (input: string): Direction[] => {
  const splat = input.split('');
  const res = [];

  let prev: string | undefined;
  for (let index = 0; index < splat.length; index++) {
    const char = splat[index];
    if (prev === 's' || prev === 'n') {
      res.push(`${prev}${char}`);
    } else if (char !== 's' && char !== 'n') {
      res.push(char);
    }
    prev = char;
  }
  return res as Direction[];
};

const makeData = (input: string) => splitMap(input, parseLine);

const getTilePosition = (data: Direction[]): [number, number] => {
  let x = 0;
  let y = 0;

  data.forEach((dir) => {
    switch (dir) {
      case 'e': {
        x++;
        break;
      }
      case 'se': {
        y--;
        // x++;
        break;
      }
      case 'sw': {
        y--;
        x--;
        break;
      }
      case 'w': {
        x--;
        break;
      }
      case 'nw': {
        y++;
        // x--;
        break;
      }
      case 'ne': {
        y++;
        x++;
        break;
      }

      default:
        break;
    }
  });

  return [x, y];
};

const testDataString = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`;

const testData = makeData(testDataString);

type Color = '.' | '#';

const findTiles = (tileDirections: Direction[][]) => {
  const flipped = new Map<string, 'black' | 'white'>();
  // debugger;
  // const positions: Set<[number, number]> = new Set();
  tileDirections.forEach((tileD) => {
    const [x, y] = getTilePosition(tileD);
    const stringed = `${x},${y}`;
    // positions.add(stringed);
    const prev = flipped.get(stringed);
    if (typeof prev === 'undefined') {
      flipped.set(stringed, 'black');
    } else {
      flipped.set(stringed, prev === 'black' ? 'white' : 'black');
    }
  });

  const blackPositions = [];
  let xMin = 0;
  let xMax = 0;
  let yMin = 0;
  let yMax = 0;
  for (const k of flipped.keys()) {
    const [xS, yS] = k.split(',');
    const x = parseInt(xS, 10);
    const y = parseInt(yS, 10);
    if (x < xMin) {
      xMin = x;
    }
    if (x > xMax) {
      xMax = x;
    }
    if (y < yMin) {
      yMin = y;
    }
    if (y > yMax) {
      yMax = y;
    }
    if (flipped.get(k) === 'black') {
      blackPositions.push([x, y]);
    }
  }

  const tiles: Color[][] = [];

  for (let index = yMin - 500; index < yMax + 500; index++) {
    const line: Color[] = [];
    for (let i = xMin - 500; i < xMax + 500; i++) {
      line.push('.');
    }
    tiles.push(line);
  }

  const middleX = Math.floor(tiles.length / 2);
  const middleY = Math.floor(tiles[0].length / 2);

  blackPositions.forEach(([x, y]) => {
    tiles[middleX + x][middleY + y] = '#';
  });

  return tiles;

  // let blackCount = 0;
  // for (const v of flipped.values()) {
  //   if (v === 'black') {
  //     blackCount++;
  //   }
  // }
  // return blackCount;
};
const getFromDelta = (
  arr: string[][],
  [newLineIndex, newSeatIndex]: [number, number]
): Color | false => {
  const newLine = arr[newLineIndex];
  if (!newLine) return false;
  const newSeat = newLine[newSeatIndex];
  if (!newSeat) return false;

  return newSeat === '.' ? '.' : '#';
};

const black = '#';
const white = '.';

const countSurroundingBlackTiles = (
  arr: Color[][],
  lineIndex: number,
  seatIndex: number
) => {
  const deltas = [
    [1, 0],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [0, 1],
    [1, 1],
  ];

  return deltas.reduce((p, [newLineIndex, newSeatIndex]) => {
    const newSeat = getFromDelta(arr, [
      lineIndex + newLineIndex,
      seatIndex + newSeatIndex,
    ]);
    if (!newSeat) return p;

    return newSeat === black ? p + 1 : p;
  }, 0 as number);
};

const applyTileRules = (input: Color[][]) => {
  const result = input.map((x) => x.slice()).slice();
  for (let lineIndex = 0; lineIndex < result.length; lineIndex++) {
    const line = input[lineIndex];
    for (let tileIndex = 0; tileIndex < line.length; tileIndex++) {
      const tile = line[tileIndex];
      const blackCount = countSurroundingBlackTiles(
        input,
        lineIndex,
        tileIndex
      );
      if (tile === black && (blackCount === 0 || blackCount > 2)) {
        result[lineIndex][tileIndex] = white;
      } else if (tile === white && blackCount === 2) {
        result[lineIndex][tileIndex] = black;
      } else {
        result[lineIndex][tileIndex] = tile;
      }
    }
  }
  return result;
};

const runTimesAndCountBlack = (input: Color[][], times: number) => {
  let arr = R.clone(input);
  for (let index = 0; index < times; index++) {
    arr = applyTileRules(arr);
  }

  return arr.reduce((p, c) => {
    return (
      p +
      c.reduce((acc, t) => {
        return acc + (t === '#' ? 1 : 0);
      }, 0)
    );
  }, 0);
};

const data = makeData(dataString);
const tiles = findTiles(data);
console.log(runTimesAndCountBlack(tiles, 100));

console.log();
