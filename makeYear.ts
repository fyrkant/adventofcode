import { makeFiles } from "./makeFile.ts";

const days: string[] = [];

for (let i = 6; i <= 25; i++) {
  days.push(i.toString().padStart(2, "0"));
}

console.log(days);

days.forEach((day) => {
  makeFiles("2019", day);
});
