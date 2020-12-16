import { existsSync, writeFileSync } from 'fs';

const [year, day] = process.argv.slice(2);

if (!year || !day) {
  throw new Error('you need to specify year and day');
}

const codeFilePath = `./${year}/${day}`;
const dataFilePath = `./${year}/data/${day}`;

if (existsSync(codeFilePath) || existsSync(dataFilePath)) {
  throw new Error('some of those files already exist');
}

writeFileSync(
  codeFilePath,
  `import { data } from './data/${day}';
  import { strictEqual } from 'assert';";`
);
writeFileSync(dataFilePath, 'export const data = ``;');

export {};
