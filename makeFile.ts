const [year, day] = Deno.args;

if (!year || !day) {
  throw new Error("you need to specify year and day");
}

const exists = (path: string) => {
  const s = Deno.statSync(path);

  return s.isFile || s.isDirectory;
};

const codeFilePath = `./${year}/${day}.ts`;
const dataFilePath = `./${year}/data/${day}.ts`;

if (exists(codeFilePath) || exists(dataFilePath)) {
  throw new Error("some of those files already exist");
}

const writeCodeFile = Deno.writeTextFile(
  codeFilePath,
  `import { data } from "./data/${day}.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";`,
);
const writeDataFile = Deno.writeTextFile(
  dataFilePath,
  "export const data = ``;",
);

Promise.all([writeCodeFile, writeDataFile]).then(() => {
  console.log("created files");
});
