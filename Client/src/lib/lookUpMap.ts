export function createLookup<T>(
  array: T[],
  key: keyof T,
  value: keyof T,
): Map<string, string> {
  return new Map(array.map((item) => [String(item[key]), String(item[value])]));
}
