import { JSObject } from '@iazlabs/js-object';

export interface CollectionInterface<K, V> {
  /**
   *
   * @param key
   * @param value
   */
  add(key: K, value: V): void;

  /**
   *
   * @param key
   */
  contains(key: K): boolean;

  /**
   *
   * @param key
   */
  has(key: K): boolean;

  /**
   * Returns the number of items in the collection
   */
  count(): number;

  /**
   * Returns the number of items in the collection
   */
  size(): number;

  /**
   *
   * @param key
   */
  get(key: K): V;

  /**
   *
   * @param key
   * @param value
   */
  set(key: K, value: V): void;

  /**
   * Returns the list of keys in the collection
   */
  keys(): K[];

  /**
   *
   * @param key
   */
  remove(key: K | K[]): CollectionInterface<K, V>;

  /**
   * @description Returns the list of items contains in the collection
   */
  values(): V[];

  /**
   * @description Removes all items from the collection / reinitialize collection items
   */
  clear(): void;

  /**
   * Return the collection iterator
   */
  [Symbol.iterator](): Iterator<V>;
}

export class Collection<K, V> implements CollectionInterface<K, V> {
  // Properties
  private items: Map<K, V> = new Map();
  private counter = 0;

  /**
   * @description Build a new collection from a predefined collection. Provide a shalow copy of the collection passed as parameter
   * @param source [[ICollection<T>]]
   */
  static from<K, V>(source: CollectionInterface<K, V>) {
    const self = new Collection<K, V>();
    source.keys().forEach(k => {
      self.add(k, source.get(k));
    });
    return self;
  }

  /**
   * @inheritdoc
   */
  add(key: K, value: V): void {
    if (!this.items.has(key)) {
      this.counter++;
      this.items.set(key, value);
    }
  }

  /**
   * @inheritdoc
   */
  contains = (key: K) => this.items.has(key);

  /**
   *
   * @param key
   */
  has = (key: K) => this.items.has(key);

  /**
   * @inheritdoc
   */
  count = () => this.counter;

  /**
   * Returns the number of items in the collection
   */
  size = () => this.counter;

  /**
   * @inheritdoc
   */
  get = (key: K) => this.items.get(key) as V;

  /**
   * @inheritdoc
   */
  set = (key: K, value: V) => {
    this.items.set(key, value);
  };

  /**
   * @inheritdoc
   */
  keys = () => Array.from(this.items.keys());

  /**
   * @inheritdoc
   */
  remove(key: K | K[]) {
    Array.isArray(key)
      ? key.forEach(k => this.deleteKey(k))
      : this.deleteKey(key);
    return this;
  }

  private deleteKey(key: K): void {
    if (!this.contains(key)) {
      return;
    }
    this.items.delete(key);
    this.counter--;
  }

  /**
   * @inheritdoc
   */
  values = () => Array.from(this.items.values());

  *[Symbol.iterator]() {
    for (const iterator of this.items.values()) {
      yield iterator;
    }
  }

  /**
   * @inheritdoc
   */
  clear(): void {
    this.items.clear();
    this.counter = 0;
  }
}

/**
 *
 * @param controls
 * @param using
 * @returns
 */
export const collect = <K, V>(controls: V[], using?: K) => {
  const collection = new Collection<K, V>();
  controls.forEach((current: V, index: number) => {
    collection.add(
      typeof using === 'string' ? JSObject.getProperty(current, using) : index,
      current
    );
  });
  return collection;
};
