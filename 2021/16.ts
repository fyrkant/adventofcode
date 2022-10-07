import { dataString } from './data/16.ts';
import { assertEquals } from 'https://deno.land/std@0.117.0/testing/asserts.ts';

const handleData = (input: string): string => {
  return input
    .split('')
    .map((x) => parseInt(x, 16).toString(2).padStart(4, '0'))
    .join('');
};

assertEquals(handleData('D2FE28'), '110100101111111000101000');
assertEquals(
  handleData('38006F45291200'),
  '00111000000000000110111101000101001010010001001000000000'
);
