import { makeFiles } from './makeFile.ts';

const days: string[] = []

for (let i = 1; i <= 25; i++) {
  days.push(i.toString().padStart(2, '0'));
}

console.log(days);

days.forEach((day) => {
  makeFiles('2022', day);
});

