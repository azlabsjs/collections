type Predicate<T> = (value: T, index?: number) => boolean;
type Comparator<T> = (target: T, value: T) => boolean;
// type IterableIncludes = (
//   value: { has: (prop: string) => boolean },
//   key: string
// ) => boolean;
// type ArrayIncludes<T> = (list: T[], key: string) => boolean;
// type ArrayIncludesWith<T> = (
//   list: T[],
//   key: T,
//   comparator: Comparator<T>
// ) => boolean;
// type ListIncludes<T> =
//   | ArrayIncludes<T>
//   | IterableIncludes
//   | ArrayIncludesWith<T>;

type ContainerInterface = { has: (prop: string, value?: any) => boolean };

// const LARGE_ARRAY_SIZE = 200;
const CHUNK_SIZE_LIMIT = 512;

/**
 * Class de manipulation des Objet de type tableau
 */
export class JSArray {
  /**
   * @description Filter a list item based on a specific condition
   */
  public static filter = <T extends ContainerInterface | any>(
    list: T[],
    key: string | Predicate<T>,
    match?: any
  ) =>
    typeof key === 'function'
      ? list.filter(key)
      : list.filter(value => {
          return (value as ContainerInterface).has(key, match);
        });

  /**
   * @description Zip a list of item into an Array List
   * @param list List of items
   * @param size Size of each chunk
   */
  public static chunk<T>(list: T[], size: number) {
    const temp = [];
    size = Math.min(CHUNK_SIZE_LIMIT, size);
    for (let index = 0; index < list.length; index += size) {
      temp.push(list.slice(index, index + size));
    }
    return temp;
  }

  /**
   * @description Sort an array of items based on a specific condition
   * @param list List of items
   * @param path List of properties to compare
   * @param order Sorting order of the output list
   */
  public static sort<T>(
    list: T[],
    path?: string[] | string | ((a: T, b: T) => number),
    order = 1
  ) {
    order = order ?? 1;
    // Check if is not null
    if (typeof list === 'undefined' || list === null) {
      return [];
    }
    if (typeof path === 'function') {
      return [...list].sort(path);
    }

    if (typeof path === 'undefined' || path === null) {
      return [...list].sort((a, b) => (a > b ? order : order * -1));
    }

    return [...list].sort((a: any, b: any) => {
      // We go for each property followed by path
      if (path instanceof Array) {
        path.forEach(property => {
          a = a[property];
          b = b[property];
        });
      } else {
        a = a[path];
        b = b[path];
      }
      // order * (-1): We change our order
      // Compare dates
      if (Date.parse(a as string) && Date.parse(b as string)) {
        a = new Date(a as string);
        b = new Date(b as string);
      }
      return a > b ? order : order * -1;
    });
  }

  /**
   * @description Convert a multi-dimensional array into a single dimensional array
   * @param list A two dimensionnal array of objects
   */
  public static flatten = <T>(list: T[], depth = Infinity) =>
    list.flat(depth);

  /**
   *
   * @param list
   * @param n
   * @returns
   */
  public static take = (list: any[], n: number) => list.slice(0, n);

  /**
   * @description Returns a sublist skipping a given number of items
   * @param list List of objects
   * @param index Starting index
   */
  public static skip = (list: any[], index: number) => list.slice(index);

  /**
   * @description Sort a list of object by a property key
   * @param list List of objects
   * @param key Comparison key
   * @param order [[number]]
   */
  public static sortBy = <T>(list: T[], key: string, order = 1) =>
    JSArray.sort(list, key, order);

  /**
   * @description Checks if an item is an Array or not
   * @param value [[any]]
   */
  public static isArray = (value: any) => Array.isArray(value);

  public static equals(list1: any[], list2: any[]) {
    if (list1.length !== list2.length) {
      return false;
    }
    for (const i of list1) {
      if (!list2.includes(i)) {
        return false;
      }
    }
    for (const i of list2) {
      if (!list1.includes(i)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @description Returns boolean result depending on wheter all values of the second array are in the first array
   * @param list [[any[]]]
   * @param sublist [[any[]]]
   */
  public static containsAll = (list: any[], sublist: any[]) =>
    JSArray.equals(JSArray.intersect(list, sublist), sublist);

  /**
   * Returns values in both a and b list
   */
  public static intersect = <T>(a: T[], b: T[]) => {
    const b_ = new Set(b);
    return [...new Set(a)].filter(e => b_.has(e));
  };

  /**
   * Returns a copy of {values} rejecting items matching the predicate
   *
   * @param values
   * @param callback
   * @returns
   */
  public static reject = <T>(values: T[], callback: Predicate<T>) =>
    JSArray.filter(values, value => !callback(value));

  /**
   * Compute the diff of two set of values
   * @returns
   */
  public static diff = <T>(a: T[], b: T[]) =>
    Array.from(
      new Set([
        ...a.filter(x => !b.includes(x)),
        ...b.filter(x => !a.includes(x)),
      ])
    );

  /**
   * Compute the diff of two set of values
   * @returns
   */
  public static symetricDiff = <T>(a: T[], b: T[]) => {
    a = a ?? [];
    b = b ?? [];
    const aLength = a.length;
    const bLength = b.length;
    let least: T[] = [];
    if (aLength > bLength) {
      least = a.slice(bLength);
      a = a.slice(0, bLength);
    } else if (aLength < bLength) {
      least = b.slice(aLength);
      b = b.slice(0, aLength);
    }
    function* func() {
      for (let index = 0; index < a.length; index++) {
        if (a[index] !== b[index]) {
          yield a[index];
        }
      }
      for (let index = 0; index < b.length; index++) {
        if (a[index] !== b[index]) {
          yield b[index];
        }
      }
      for (const iterator of least) {
        yield iterator;
      }
    }
    return Array.from(new Set(func()));
  };

  /**
   * Returns the last element of the list
   *
   */
  static last = <T>(values: T[]) => {
    if (0 === (values?.length ?? 0)) {
      return undefined;
    }
    return values.slice(-1)[0];
  };

  static includes = <T>(list: T[], target: T, offset = 0) =>
    list.includes(target, offset);

  static seqSearch = <T>(list: T[], target: T, comparator?: Comparator<T>) => {
    const length = list?.length ?? 0;
    if (0 === length) {
      return false;
    }
    comparator =
      comparator ??
      function(target, value) {
        return target === value;
      };
    for (const value of list) {
      if (comparator(target, value)) {
        return true;
      }
    }
    return false;
  };

  static tail = <T>(list: T[], from = 0) => {
    if (typeof list === 'undefined' || list === null) {
      return [];
    }
    const [, ...result] = list.slice(from);
    return result;
  };

  // /**
  //  * Compute a set/list of unique values using the user given key
  //  *
  //  * @param values
  //  * @param iteratee
  //  * @returns
  //  */
  // public static uniq = <T extends any>(
  //   values: T[],
  //   iteratee?: Function,
  //   comparator?: Comparator<T>
  // ) => {
  //   let index = -1;
  //   let includes: ListIncludes<T>;
  //   includes = (list: T[], target: T) => JSArray.includes(list, target);
  //   const { length } = values;
  //   let isLargeList = length >= JSArray.LARGE_ARRAY_SIZE;
  //   let isCommon =
  //     (typeof comparator === 'undefined' || comparator === null) &&
  //     !isLargeList;
  //   if (isLargeList && (typeof iteratee === 'undefined' || iteratee === null)) {
  //     return Array.from(new Set(values));
  //   }

  //   // if (isLargeList) {
  //   // Use collection DS
  //   // } else {
  //   // TODO : Use Array DS
  //   // }
  //   // const result: Set<T> = new Set();
  //   // let seen = iteratee ? [] : Array.from(result);
  //   // if (comparator) {
  //   //   includes = (list: T[], target: T, comparator: Comparator<T>) =>
  //   //     JSArray.seqSearch(list as T[], target, comparator);
  //   // } else if (isLargeList) {
  //   //   includes = (x: { has: (prop: string) => boolean }, key: string) =>
  //   //     x.has(key);
  //   // }
  //   outer: while (++index < length) {
  //     let value = values[index];
  //     // const computed = iteratee ? iteratee(value) : value;
  //     // const value_ = comparator ?? value !== 0 ? value : undefined;
  //     // if (isCommon && computed === computed) {
  //     //   let last = seen.length;
  //     //   while (last--) {
  //     //     if (seen[last] === computed) {
  //     //       continue outer;
  //     //     }
  //     //   }
  //     //   if (iteratee) {
  //     //     seen.push(computed);
  //     //   }
  //     //   result.add(value);
  //     // } else if (
  //     //   !(includes as ArrayIncludesWith<T>)(seen, computed, comparator)
  //     // ) {
  //     //   if (seen !== result) {
  //     //     seen.push(computed);
  //     //   }
  //     //   result.push(value);
  //     // }
  //   }
  // };
}
