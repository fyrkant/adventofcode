import { dataString } from './data/01.ts';
import { assert } from "https://deno.land/std@0.166.0/testing/asserts.ts";

const testData = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

const parseData = (data: string) => {
  const groups = data.split('\n\n')

  const parsedGroups = groups.map(group => {
    const parsedGroup = group.split('\n').map(Number)
    return parsedGroup
  })

  return parsedGroups
}


const sumGroup = (group: number[]) => {
  const sum = group.reduce((acc, curr) => acc + curr, 0)
  return sum
}

const summed = parseData(dataString).map(sumGroup)

const sorted = summed.sort((a, b) => b-a)

const solvePart1 = () => {
  return sorted[0]
}

const solvePart2 = () => {
  const [one, two, three] = sorted

  return one + two + three
}

console.log('part 1', solvePart1())
console.log('part 2', solvePart2())