import { dataString } from "./data/07.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import * as mod from "https://deno.land/std@0.166.0/collections/mod.ts";
import { lodash } from "https://deno.land/x/deno_ts_lodash/mod.ts";

const testString = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

type Line = { type: "cd"; argument: string } | { type: "ls" } | {
  type: "file";
  size: number;
  name: string;
} | { type: "dir"; name: string } & Record<string, Line>;

const parseLine = (l: string): Line => {
  if (l === "$ ls") {
    return { type: "ls" };
  }
  if (l.startsWith("$ cd")) {
    return { type: "cd", argument: l.split("$ cd ").at(-1) || "" };
  }
  if (l.startsWith("dir")) {
    return { type: "dir", name: l.split("dir ").at(-1) || "" };
  }

  const [sizeString, name] = l.split(" ");

  return { type: "file", name, size: parseInt(sizeString, 10) };
};

Deno.test("parseLine", () => {
  assertEquals(parseLine("$ cd /"), { type: "cd", argument: "/" });
  assertEquals(parseLine("$ ls"), { type: "ls" });
  assertEquals(parseLine("dir x"), { type: "dir", name: "x" });
  assertEquals(parseLine("4060174 j"), {
    type: "file",
    name: "j",
    size: 4060174,
  });
  assertEquals(parseLine("8033020 d.log"), {
    type: "file",
    name: "d.log",
    size: 8033020,
  });
});

type File = { name: string; size: number };
type Dir = { files: File[] } & Record<string, Dir>;

type FS = Record<string, Dir>;

const makeTree = (input: string) => {
  const fs: FS = { "/": { files: [] } };
  const lines = input.split("\n");

  const cwd = ["/"];

  lines.map(parseLine).forEach((l) => {
    switch (l.type) {
      case "cd": {
        if (l.argument === "/") break;

        if (l.argument === "..") {
          cwd.pop();
        } else {
          const current = lodash.at(fs, cwd);

          current[l.argument] = { files: [] };
          cwd.push(l.argument);
        }
        break;
      }

      case "ls": {
        break;
      }

      case "dir": {
        const current = lodash.at(fs, cwd.join("."))[0];

        current[l.name] = { files: [] };

        break;
      }

      case "file": {
        const current = lodash.at(fs, cwd.join("."))[0];

        const { type: _, ...rest } = l;

        current.files.push(rest);

        break;
      }

      default:
        break;
    }
  });
  // console.log(JSON.stringify(fs, null, 2));
  return fs;
};

Deno.test("make file tree", () => {
  assertEquals(makeTree(testString), {
    "/": {
      files: [
        {
          name: "b.txt",
          size: 14848514,
        },
        {
          name: "c.dat",
          size: 8504156,
        },
      ],
      a: {
        e: {
          files: [
            {
              name: "i",
              size: 584,
            },
          ],
        },
        files: [
          {
            name: "f",
            size: 29116,
          },
          {
            name: "g",
            size: 2557,
          },
          {
            name: "h.lst",
            size: 62596,
          },
        ],
      },
      d: {
        files: [
          {
            name: "j",
            size: 4060174,
          },
          {
            name: "d.log",
            size: 8033020,
          },
          {
            name: "d.ext",
            size: 5626152,
          },
          {
            name: "k",
            size: 7214296,
          },
        ],
      },
    },
  });
});

const getDirSizes = (
  input: FS,
  currentPath: string[],
  sizes: Record<string, number> = {},
) => {
  const p = currentPath.join("/");
  let num = 0;
  if (!p) {
    console.error("oh no");
    return num;
  }
  Object.entries(input).forEach(([k, v]) => {
    if (k === "files" && Array.isArray(v)) {
      const s = mod.sumOf(v, (f) => f.size);
      num += (sizes[p] || 0) + s;
    } else {
      num += getDirSizes(v, currentPath.concat(k === "/" ? [] : k), sizes);
    }
  });
  sizes[p] = num;
  return num;
};

const partOne = (input: string) => {
  const x: Record<string, number> = {};
  getDirSizes(makeTree(input), ["/"], x);

  const underThousand = Object.values(x).filter((v) => v < 100000);

  return mod.sumOf(underThousand, (v) => v);
};

Deno.test("part one", () => {
  assertEquals(partOne(testString), 95437);
  assertEquals(partOne(dataString), 1086293);
});

const partTwo = (input: string) => {
  const x: Record<string, number> = {};
  const usedSpace = getDirSizes(makeTree(input), ["/"], x);

  const totalSpace = 70000000;
  const spaceNeeded = 30000000;
  const unusedSpace = totalSpace - usedSpace;

  const delta = spaceNeeded - unusedSpace;

  console.log({ usedSpace, totalSpace, spaceNeeded, unusedSpace, delta });

  const v = Object.values(x).filter((v) => v > delta).sort((a, b) => a - b);
  return v[0];
};

Deno.test("part two", () => {
  assertEquals(partTwo(testString), 24933642);
  assertEquals(partTwo(dataString), 366028);
});
