import { dataString } from './data/08.ts';
import {} from 'https://deno.land/std@0.117.0/collections/mod.ts';
import { assertEquals } from 'https://deno.land/std@0.117.0/testing/asserts.ts';
import diff from 'https://raw.githubusercontent.com/lodash/lodash/master/difference.js';
import intersection from 'https://raw.githubusercontent.com/lodash/lodash/master/intersection.js';

const testData = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

/*
0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg

*/

const segmentMap = {
  0: 'abcefg',
  1: 'cf',
  2: 'acdeg',
  3: 'acdfg',
  4: 'bcdf',
  5: 'abdfg',
  6: 'abdefg',
  7: 'acf',
  8: 'abcdefg',
  9: 'abcdfg',
};

const handleData = (i: string) => {
  return i.split('\n').map((line) => {
    const [pattern, output] = line.split(' | ');

    return {
      signalPattern: pattern.split(' ').map((x) => x.split('')),
      output: output.split(' ').map((x) => x.split('')),
    };
  });
};

const countPartOne = (i: ReturnType<typeof handleData>) => {
  const d = i
    .map((x) => x.output)
    .flat()
    .filter((x) => [2, 3, 4, 7].includes(x.length));

  return d.length;
};

const findSegmentKeys = (i: string[]): Record<string, string> => {
  const r: Record<string, string> = {};

  i.forEach((segment) => {
    if (segment.length === 2) {
      segment.split('').forEach((x, i) => {
        console.log(x, segmentMap[1][i]);
        r[x] = segmentMap[1][i];
      });
    } else if (segment.length === 3) {
      segment.split('').forEach((x, i) => {
        console.log(x, segmentMap[7][i]);

        r[x] = segmentMap[7][i];
      });
    } else if (segment.length === 4) {
      segment.split('').forEach((x, i) => {
        console.log(x, segmentMap[4][i]);

        r[x] = segmentMap[4][i];
      });
    } else if (segment.length === 7) {
      segment.split('').forEach((x, i) => {
        console.log(x, segmentMap[8][i]);

        r[x] = segmentMap[8][i];
      });
    }
  });

  return r;
};

const partTwo = (i: ReturnType<typeof handleData>): number => {
  const nums: number[] = [];

  i.forEach((v) => {
    const { signalPattern, output } = v;

    const r: Record<string, string> = {};

    const one = signalPattern.find((x) => x.length === 2) || [];
    const seven = signalPattern.find((x) => x.length === 3) || [];
    const eight = signalPattern.find((x) => x.length === 7) || [];
    const four = signalPattern.find((x) => x.length === 4) || [];
    r.a = diff(seven, one)[0];
    const five =
      signalPattern.find((x) => {
        return (
          x.length === 5 &&
          diff(x, four).length === 2 &&
          intersection(x, one).length === 1
        );
      }) || [];

    r.c = diff(one, five)[0];
    r.f = diff(one, [r.c])[0];

    const six =
      signalPattern.find((x) => {
        return x.length === 6 && diff(x, five).length === 1 && !x.includes(r.c);
      }) || [];

    diff(six, five).forEach((x) => {
      r.e = x;
    });

    const zero =
      signalPattern.find((x) => {
        return x.length === 6 && x.includes(r.e) && diff(x, six).length !== 0;
      }) || [];
    const two =
      signalPattern.find((x) => {
        return x.length === 5 && x.includes(r.e);
      }) || [];
    const three =
      signalPattern.find((x) => {
        return x.length === 5 && !x.includes(r.e) && diff(x, five).length !== 0;
      }) || [];

    const nine =
      signalPattern.find((x) => {
        return ![one, two, three, four, five, six, seven, eight, zero].includes(
          x
        );
      }) || [];

    const foundNums = [
      zero,
      one,
      two,
      three,
      four,
      five,
      six,
      seven,
      eight,
      nine,
    ];

    const num = output
      .map((x) => {
        const i = foundNums.findIndex(
          (y) => x.length === y.length && diff(x, y).length === 0
        );

        return i;
      })
      .join('');

    nums.push(parseInt(num, 10));
  });

  return nums.reduce((p, e) => p + e, 0);
};

/*

fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
*/

// const td = handleData(
//   'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'
// );
// assertEquals(partTwo(td), 5353);
assertEquals(
  partTwo(
    handleData(
      `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe`
    )
  ),
  8394
);
assertEquals(
  partTwo(
    handleData(
      `fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg`
    )
  ),
  1197
);
assertEquals(
  partTwo(
    handleData(
      `edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc`
    )
  ),
  9781
);
const d = handleData(dataString);

// console.log(countPartOne(td));
console.log(partTwo(d));
