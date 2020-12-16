import { data } from './data/1.ts';
import { assertEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts';
import { splitMap } from '../utils.ts';

const parseLine = (input: string) => parseInt(input, 10);

const arr = splitMap(data, parseLine);

const doCalc = (input: number) => {
  return Math.floor(input / 3) - 2;
};

const getFuel = (input: number): number => {
  const x = doCalc(input);
  const y = doCalc(x);

  return y < 0 ? x : x + getFuel(x);
};

assertEquals(doCalc(12), 2);
assertEquals(doCalc(14), 2);

const sum = arr.reduce((p, c) => p + getFuel(c), 0);

console.log(sum);
