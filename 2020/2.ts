import { data } from './data/2.ts';

const parseLine = (string: string) => {
  const [numbers, character, input] = string.split(' ');
  const [one, two] = numbers.split('-');

  return {
    min: parseInt(one, 10),
    max: parseInt(two),
    char: character[0],
    input,
  };
};

const testInput1 = (data: ReturnType<typeof parseLine>): boolean => {
  const count = data.input
    .split('')
    .reduce((prev, curr) => (curr === data.char ? prev + 1 : prev), 0);
  return count >= data.min && count <= data.max;
};

const testInput = (data: ReturnType<typeof parseLine>): boolean => {
  const splat = data.input.split('');
  const firstPosition = splat[data.min - 1] === data.char;
  const secondPosition = splat[data.max - 1] === data.char;
  return (
    (firstPosition && !secondPosition) || (!firstPosition && secondPosition)
  );
};

const testString = '10-11 b: bbbbbbbbbpj';

const splitData = data.split('\n');

const output = splitData.reduce((prev, line) => {
  return testInput(parseLine(line)) ? prev + 1 : prev;
}, 0);

console.log(output);
