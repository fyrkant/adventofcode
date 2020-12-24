import { strictEqual } from 'assert';
import * as R from 'remeda';
import _, { indexOf } from 'lodash';
import { data } from './data/20';

const testData = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;
type Tile = { id: number; tiles: string[][] };
const parseTile = (input: string): Tile => {
  const arr = input.split('\n');
  const [id, ...ts] = arr;

  const tiles: string[][] = ts.map((l) => l.split(''));

  return { id: parseInt(id.substr(5), 10), tiles };
};

const makeData = (input: string): Tile[] => {
  const tileStrings = input.split('\n\n');
  return tileStrings.map(parseTile);
};

// const findMatch = ()

const rotateGrid = (grid: string[][]) =>
  _.map(_.head(grid), (v, i) => _.reverse(_.map(grid, (row) => row[i])));

const flipGrid = (grid: string[][], dir: 'vertical' | 'horizontal') =>
  dir === 'vertical' ? _.map(grid, _.reverse) : R.reverse(grid);

// const d = makeData(testData);

type Sides = [top: string, right: string, bottom: string, left: string];
const getSides = (grid: string[][]): Sides => {
  const top = _.reduce(_.head(grid), (p, c) => p + c, '');
  const bottom = _.reduce(_.last(grid), (p, c) => p + c, '');
  const right = _.reduce(grid, (p, c) => p + (R.last(c) || ''), '');
  const left = _.reduce(grid, (p, c) => p + (R.first(c) || ''), '');

  return [top, right, bottom, left];
};

const findWithMatching = (side: string) => (t: Tile) => {
  const sides = getSides(t.tiles);

  return (
    sides.includes(side) || sides.includes(side.split('').reverse().join(''))
  );
};

const findTopLeftCorner = (tiles: Tile[]): Tile | false => {
  for (const tile of tiles) {
    const others = tiles.filter((tx) => tx.id !== tile.id);
    const sides = getSides(tile.tiles);
    const [t, r, b, l] = sides.map((s) => others.find(findWithMatching(s))?.id);
    if (
      _.isUndefined(t) &&
      _.isNumber(r) &&
      _.isNumber(b) &&
      _.isUndefined(l)
    ) {
      return tile;
    }
  }
  return false;
};
// const findCorners = (tiles: Tile[]): Tile[] => {
//   const res: Tile[] = [];
//   for (const tile of tiles) {
//     const others = tiles.filter((t) => t.id !== tile.id);
//     const sides = getSides(tile.tiles);
//     const foundSides = sides
//       .map((s) => others.filter(findWithMatching(s)).map(R.prop('id')))
//       .filter((v) => v.length > 0);
//     if (foundSides.length === 2) {
//       res.push(tile);
//     }
//   }
//   return res;
// };

// const findCornersSum = (tiles: Tile[]) => {
//   const res: number[][] = [];
//   const root = Math.sqrt(tiles.length);

//   const corners = findCorners(tiles);
//   return corners.reduce((p, c) => p * c.id, 1);
// };

// const findTileNextToCurrent = (tile:Tile, p tiles:Tile[])
type Pos = 't' | 'r' | 'b' | 'l';
const findAndGetSides = (
  tiles: Tile[],
  side: string
): [tile: Tile, pos: Pos, reversed: boolean] | false => {
  for (let index = 0; index < tiles.length; index++) {
    const tile = tiles[index];
    const sides = getSides(tile.tiles);
    const [t, r, b, l] = sides;

    const x: Record<string, Pos> = {
      [t]: 't',
      [r]: 'r',
      [b]: 'b',
      [l]: 'l',
    };

    const match = x[side];

    if (match) {
      return [tile, match, false];
    }
    const reverseMatch = x[side.split('').reverse().join('')];
    if (reverseMatch) {
      return [tile, reverseMatch, true];
    }
  }
  return false;
};

const getTurns = (from: Pos, to: Pos) => {
  const positions: Pos[] = ['t', 'r', 'b', 'l'];
  const fromIndex = positions.indexOf(from);
  const toIndex = positions.indexOf(to);

  const diff = toIndex - fromIndex;
  const x = Math.sign(diff) === -1 ? positions.length + diff : diff;
  return x;
};

const findAndRotate = (
  wantedPosition: 'l' | 't',
  side: string,
  tiles: Tile[]
): Tile | undefined => {
  const found = findAndGetSides(tiles, side);
  if (!found) return;
  const [foundTile, pos, r] = found;
  const reverse = false;
  if (pos === wantedPosition) {
    const x = {
      ...foundTile,
      tiles: reverse
        ? flipGrid(
            foundTile.tiles,
            wantedPosition === 't' ? 'vertical' : 'horizontal'
          )
        : foundTile.tiles,
    };
    // debugger;
    return x;
  }
  const turns = getTurns(pos, wantedPosition);
  let rotatedTiles = R.clone(foundTile.tiles);
  R.times(turns, () => {
    rotatedTiles = rotateGrid(rotatedTiles);
  });
  return {
    ...foundTile,
    tiles: reverse
      ? flipGrid(
          rotatedTiles,
          wantedPosition === 't' ? 'vertical' : 'horizontal'
        )
      : rotatedTiles,
  };
};

const buildUp = (tiles: Tile[]) => {
  const root = Math.sqrt(tiles.length);
  const leftTop = findTopLeftCorner(tiles);
  if (!leftTop) return;

  const res: Tile[][] = [[leftTop]];
  let currentLine = 0;
  let others = tiles.filter((x) => x.id !== leftTop.id);
  let current = leftTop;
  do {
    if (!res[currentLine]) {
      res[currentLine] = [];
    }
    const currentSides = getSides(current.tiles);
    const currentIndex = res[currentLine === 0 ? 0 : currentLine - 1].indexOf(
      current
    );
    // if (currentLine === 0) {
    const found = findAndRotate(
      currentLine === 0 ? 'l' : 't',
      currentSides[currentLine === 0 ? 1 : 2],
      others
    );
    if (!found) {
      current = res[currentLine][0];
      currentLine += 1;
    } else {
      const lineArr = res[currentLine];
      others = others.filter((t) => t.id !== found.id);
      res[currentLine] = lineArr ? lineArr.concat(found) : [found];
      const maybeNext =
        currentLine === 0 ? found : res[currentLine - 1][currentIndex + 1];
      if (maybeNext) {
        current = maybeNext;
      } else {
        current = res[currentLine][0];
        currentLine += 1;
      }
    }
    // } else {
    // }
  } while (others.length > 0);
  const s = res.map((l) => l.map(R.prop('tiles')));
  return s;
};

// strictEqual(findCornersSum(makeData(testData)), 20899048083289);
// strictEqual(findCornersSum(makeData(data)), 64802175715999);

const placedTiles = buildUp(makeData(testData));
if (placedTiles) {
  const withoutBorders = placedTiles.map((l) => {
    return l.map((t) => {
      const withoutTopBottom = t.slice(1, t.length - 1);
      return withoutTopBottom.map((x) => {
        return x.slice(1, x.length - 1);
      });
    });
  });
  debugger;
  const xs = [];
  for (let i = 0; i < withoutBorders.length; i++) {
    const gridLine = withoutBorders[i];
    const l: string[][] = [];
    for (let ii = 0; ii < gridLine.length; ii++) {
      const element = gridLine[ii];
      for (let iii = 0; iii < element.length; iii++) {
        if (!l[ii]) {
          l[ii] = [];
        }
        // debugger;x
        const r = element[iii];
        l[ii].push(...r);
      }
    }
    debugger;
  }
  console.log(placedTiles);
}
