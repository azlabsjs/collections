import { IterableType } from "@iazlabs/functional";

// Collect the values of a stream into an array
export const ListCollector = <T>(value: IterableType<T>) =>
  Array.from(value);

/**
 * Creates a set from stream values.
 *
 * @example
 * const set = Stream.iterate(1, x => x + 1)
 *                    .take(20)
 *                    .collect(SetCollector);
 *
 * @param value
 * @returns
 */
export const SetCollector = <T>(value: IterableType<T>) => new Set(value);

/**
 * Creates a javascript map from list of values produce by a stream.
 *
 * @example
 * // Basic usage
 * const set = Stream.from((function*() {
 *                      const users = [{
 *                          name: "Ben Foster",
 *                          gp: 20.94
 *                      },
 *                      {
 *                          name: "Larry Be",
 *                          gp: 90.94
 *                      }];
 *                      for(const u of users) {
 *                          yield u;
 *                      }
 *                    })())
 *                    .collect(MapCollector(x => x.name, Identity));
 *
 * @param keyMapper
 * @param valueMapper
 * @param mergeFunction
 */
export const MapCollector = <T, KeyType, ValueType>(
  keyMapper: (value: T) => KeyType,
  valueMapper: (value: T) => ValueType,
  mergeFunction?: (a: T | ValueType, b: T) => KeyType
) => (iterator: IterableType<T>) => {
  const map = new Map<KeyType, ValueType>();
  for (const current of iterator) {
    let key = keyMapper(current);
    if (mergeFunction && map.has(key)) {
      const value = map.get(key);
      if (value) {
        key = mergeFunction(value, current);
      }
    }
    map.set(key, valueMapper(current));
  }
  return map;
};
