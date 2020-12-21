import { data } from './data/20';
import { strictEqual } from 'assert';
import * as R from 'remeda';
import _ from 'lodash';

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

const rotateGrid = (grid: string[][]) => {
  return _.map(_.head(grid), (v, i) => _.reverse(_.map(grid, (row) => row[i])));
};

const flipGrid = (grid: string[][]) => {
  return _.map(grid, _.reverse);
};

const d = makeData(testData);
const tiles = d[0].tiles;

const addStrings = (p: string, c: string) => p + c;

const getSides = (
  grid: string[][]
): [top: string, right: string, bottom: string, left: string] => {
  const top = _.reduce(_.head(grid), (p, c) => p + c, '');
  const bottom = _.reduce(_.last(grid), (p, c) => p + c, '');
  const right = _.reduce(grid, (p, c) => p + _.last(c), '');
  const left = _.reduce(grid, (p, c) => p + _.head(c), '');

  return [top, right, bottom, left];
};

const findWithMatching = (side: string) => (t: Tile) => {
  const sides = getSides(t.tiles);

  return (
    sides.includes(side) || sides.includes(side.split('').reverse().join(''))
  );
};

// const findTopLeftCorner = (tiles: Tile[]): Tile => {
//   for (const tile of tiles) {
//     const others = tiles.filter((t) => t.id !== tile.id);
//     const sides = getSides(tile.tiles);
//     const [t, r, b, l] = sides.map((s) => others.find(findWithMatching(s))?.id);
//     if (
//       _.isUndefined(t) &&
//       _.isNumber(r) &&
//       _.isNumber(b) &&
//       _.isUndefined(l)
//     ) {
//       return tile;
//     }
//   }
// };
const findCorners = (tiles: Tile[]): Tile[] => {
  let res: Tile[] = [];
  for (const tile of tiles) {
    const others = tiles.filter((t) => t.id !== tile.id);
    const sides = getSides(tile.tiles);
    const foundSides = sides
      .map((s) => others.filter(findWithMatching(s)).map(R.prop('id')))
      .filter((v) => v.length > 0);
    if (foundSides.length === 2) {
      res.push(tile);
    }
  }
  return res;
};

const findCornersSum = (tiles: Tile[]) => {
  const res: number[][] = [];
  const root = Math.sqrt(tiles.length);

  const corners = findCorners(tiles);
  return corners.reduce((p, c) => p * c.id, 1);
};

strictEqual(findCornersSum(makeData(testData)), 20899048083289);
strictEqual(findCornersSum(makeData(data)), 64802175715999);
