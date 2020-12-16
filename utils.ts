export const unique = <T>(arr: T[]): T[] => {
  return [...new Set([...arr])];
};

export const splitMap = <T>(
  input: string,
  mapFn: (x: string) => T,
  splitString = '\n'
) => {
  return input.split(splitString).map(mapFn);
};

export const replaceArrVal = (
  arr: number[],
  index: number,
  newVal?: number
) => {
  return arr
    .slice(0, index)
    .concat(newVal ? newVal : [])
    .concat(arr.slice(index + 1));
};
