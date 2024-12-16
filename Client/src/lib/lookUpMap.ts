export function createLookup<T>(
  array: T[],
  key: keyof T,
  value: keyof T,
): Map<string, string> {
  return new Map(array.map((item) => [String(item[key]), String(item[value])]));
}

// export const createLookup = (array: any, key: any, value: any) => {
//   const map = new Map();
//   array.forEach((item: any) => {
//     map.set(item[key], item[value]);
//   });
//   return map;
// };
