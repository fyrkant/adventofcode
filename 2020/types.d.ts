export type ObjectKeys<T> = T extends Record<string, unknown>
  ? (keyof T)[]
  : T extends number
  ? []
  : T extends Array<unknown> | string
  ? string[]
  : never;
