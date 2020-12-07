export const getUnique = <T>(arr: T[]): T[] => {
  return [
    ...new Set([
      ...arr,
    ]),
  ];
};
