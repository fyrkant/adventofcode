import { data } from './data/8.ts';
import { assertEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts';

const parseLine = (input: string): { instruction: string; arg: number } => {
  const [instruction, arg] = input.split(' ');

  return { instruction, arg: parseInt(arg, 10) };
};

assertEquals(parseLine('nop +0'), { instruction: 'nop', arg: 0 });
assertEquals(parseLine('jmp +4'), { instruction: 'jmp', arg: 4 });
assertEquals(parseLine('acc -99'), { instruction: 'acc', arg: -99 });
assertEquals(parseLine('acc +1'), { instruction: 'acc', arg: 1 });

const getAcc = (array: ReturnType<typeof parseLine>[]): number | false => {
  let acc = 0;
  const nums = new Set<number>();
  let index = 0;

  while (!nums.has(index)) {
    nums.add(index);
    const element = array[index];

    if (index > array.length - 1) {
      return acc;
    }

    switch (element.instruction) {
      case 'nop':
        index = index + 1;
        break;
      case 'acc':
        acc = acc + element.arg;
        index = index + 1;
        break;
      case 'jmp':
        index = index + element.arg;
        break;
      default:
        break;
    }
  }

  return false;
};

const testData = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

const getRealAcc = (arr: ReturnType<typeof parseLine>[]) => {
  for (let index = 0; index < arr.length; index++) {
    const line = arr[index];

    if (line.instruction === 'jmp' || line.instruction === 'nop') {
      const newArr = [
        ...arr.slice(0, index),
        { ...line, instruction: line.instruction === 'jmp' ? 'nop' : 'jmp' },
        ...arr.slice(index + 1),
      ];
      const ret = getAcc(newArr);
      if (typeof ret === 'number') {
        return ret;
      }
    }
  }
};

assertEquals(getRealAcc(testData.split('\n').map(parseLine)), 8);

assertEquals(getRealAcc(data.split('\n').map(parseLine)), 2477);
