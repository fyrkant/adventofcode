import { existsSync } from "https://deno.land/std@0.88.0/fs/exists.ts";

const write = (path:string, input:string) => {
  const data = new TextEncoder().encode(input);

  Deno.writeFileSync(path, data);
}

const makeFiles = (year: string, day: string): void => {
  if (!year || !day) {
    throw new Error('you need to specify year and day');
  }

  const codeFilePath = `./${year}/${day}.ts`;
  const dataFilePath = `./${year}/data/${day}.ts`;

  if (existsSync(codeFilePath) || existsSync(dataFilePath)) {
    throw new Error('some of those files already exist');
  }

  write(
    codeFilePath,
    `import { dataString } from './data/${day}.ts';
import { assert } from "https://deno.land/std@0.166.0/testing/asserts.ts";`
  );
  write(dataFilePath, 'export const dataString = ``;');
};

export { makeFiles };
