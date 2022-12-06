import { dataString } from "./data/06.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";

const findPosition = (messageLength: number) => (input: string): number => {
  const arr = input.split("");

  for (let index = 0; index < arr.length; index++) {
    const elements = arr.slice(index, index + messageLength);

    if (mod.distinct(elements).length === messageLength) {
      return index + messageLength;
    }
  }
  return -1;
};

const partOne = findPosition(4);

Deno.test("part one", () => {
  assertEquals(partOne("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 7);
  assertEquals(partOne("bvwbjplbgvbhsrlpgdmjqwftvncz"), 5);
  assertEquals(partOne("nppdvjthqldpwncqszvftbrmjlhg"), 6);
  assertEquals(partOne("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 10);
  assertEquals(partOne("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 11);
  assertEquals(partOne(dataString), 1655);
});

const partTwo = findPosition(14);

Deno.test("part two", () => {
  assertEquals(partTwo("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 19);
  assertEquals(partTwo("bvwbjplbgvbhsrlpgdmjqwftvncz"), 23);
  assertEquals(partTwo("nppdvjthqldpwncqszvftbrmjlhg"), 23);
  assertEquals(partTwo("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 29);
  assertEquals(partTwo("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 26);

  assertEquals(partTwo(dataString), 2665);
});
