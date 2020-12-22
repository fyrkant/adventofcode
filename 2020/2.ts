import { data } from './data/2';

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

const testInput1 = (input: ReturnType<typeof parseLine>): boolean => {
  const count = input.input
    .split('')
    .reduce((prev, curr) => (curr === input.char ? prev + 1 : prev), 0);
  return count >= input.min && count <= input.max;
};

const testInput = (input: ReturnType<typeof parseLine>): boolean => {
  const splat = input.input.split('');
  const firstPosition = splat[input.min - 1] === input.char;
  const secondPosition = splat[input.max - 1] === input.char;
  return (
    (firstPosition && !secondPosition) || (!firstPosition && secondPosition)
  );
};

const testString = '10-11 b: bbbbbbbbbpj';

const splitData = data.split('\n');

const output = splitData.reduce(
  (prev, line) => (testInput(parseLine(line)) ? prev + 1 : prev),
  0
);

console.log(output);
