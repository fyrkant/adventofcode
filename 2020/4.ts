import { data } from "./data/4.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";

const required = {
  byr: "Birth Year",
  iyr: "Issue Year",
  eyr: "Expiration Year",
  hgt: "Height",
  hcl: "Hair Color",
  ecl: "Eye Color",
  pid: "Passport ID",
  cid: "Country ID",
} as const;

const testData = `hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946`;

const parseLine = (line: string) => {
  return line.split(" ").reduce((prev, curr) => {
    const [key, val] = curr.split(":");

    const ret = { ...prev, [key]: val };

    return ret;
  }, {} as Record<string, string>);
};

const minMax = (input: number, min: number, max: number) => {
  return input >= min && input <= max;
};

const yearBetween = (input: string, min: number, max: number) => {
  const num = parseInt(input, 10);

  return input.length === 4 && minMax(num, min, max);
};

const height = (
  input: string,
  cm: [number, number],
  inch: [number, number],
) => {
  const type = input.slice(input.length - 2);
  const num = parseInt(input.slice(0, input.length - 2), 10);
  return type === "cm"
    ? minMax(num, cm[0], cm[1])
    : minMax(num, inch[0], inch[1]);
};

const hairColor = (input: string) => {
  const [hash, ...rest] = input;

  return hash === "#" && /^([a-f]|[0-9]){6}$/.test(rest.join(""));
};

const eyeColor = (input: string) => {
  const approved = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

  return approved.includes(input);
};

const passPortId = (input: string) => {
  return /^[0-9]{9}$/.test(input);
};

// console.log(yearBetween("2004", 1920, 2003));
// console.log(height("60in", [150, 193], [59, 76]));
// console.log(height("150cm", [150, 193], [59, 76]));
assertEquals(hairColor("#1d23456"), true);

const validateKey = (key: keyof typeof required, input: string): boolean => {
  console.log(key, input);
  switch (key) {
    case "byr":
      return yearBetween(input, 1920, 2002);

    case "iyr":
      return yearBetween(input, 2010, 2020);

    case "eyr":
      return yearBetween(input, 2020, 2030);

    case "hgt":
      return height(input, [150, 193], [60, 76]);

    case "hcl":
      return hairColor(input);

    case "ecl":
      return eyeColor(input);

    case "pid":
      return passPortId(input);

    default:
      return true;
  }
};

type ObjectKeys<T> = T extends object ? (keyof T)[]
  : T extends number ? []
  : T extends Array<any> | string ? string[]
  : never;

const validatePassport = (pass: Partial<Record<string, string>>): boolean => {
  const keys = Object.keys(pass);

  const { cid, ...restReq } = required;
  const requiredKeys = Object.keys(restReq) as ObjectKeys<
    Omit<typeof required, "cid">
  >;

  return requiredKeys.reduce((p, c) => {
    const val = pass[c];
    const x = p && typeof val === "string" && validateKey(c, val);
    return x;
  }, true as boolean);
};

const getArrayOfObjects = (input: string): Array<Partial<typeof required>> => {
  const splat = input.split("\n");

  // console.log('splat', splat)
  const dividedStrings = splat.reduce((prev, curr) => {
    // console.log({curr})
    if (curr === "") {
      // console.log('empty', curr, prev)
      return [...prev, []];
    } else {
      // console.log('something', curr, prev)
      const prevArr = prev[prev.length - 1] || [];
      // console.log({prevArr})
      prev[Math.max(prev.length - 1, 0)] = [...prevArr, curr];
      // console.log({prev})

      return prev;
    }
  }, [] as Array<string[]>);
  // console.log('dividedStrings', dividedStrings, dividedStrings.length)

  const objects = dividedStrings.reduce((prev, current) => {
    // console.log('current',current)
    const obj = current.reduce((p, c) => {
      return { ...p, ...parseLine(c) };
    }, {} as Partial<typeof required>);

    return [...prev, obj];
  }, [] as Array<Partial<typeof required>>);

  return objects;
};

const result = getArrayOfObjects(data);

console.log(result.filter(validatePassport).length);
