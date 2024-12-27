export function createLookup<T>(
  array: T[],
  key: keyof T,
  value: keyof T,
): Map<string, string> {
  return new Map(array.map((item) => [String(item[key]), String(item[value])]));
}

function userLookup<T, K extends keyof T>(
  array: T[],
  key: K,
  value: keyof T,
): Map<T[K], T[typeof value]> {
  const map = new Map<T[K], T[typeof value]>();
  array.forEach((item) => {
    if (item[key] !== undefined && item[value] !== undefined) {
      map.set(item[key], item[value]);
    }
  });
  return map;
}
