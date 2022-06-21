import {
  CollectorFunc,
  compose,
  FilterFunc,
  Function_,
  ReducerFunc,
  UnaryFunction,
} from '@azlabsjs/functional';

type IterableType<T> =
  | Generator<T>
  | Iterable<T>
  | T[]
  | IterableIterator<T>
  | ReadonlyArray<T>
  | Set<T>
  | ReadonlySet<T>;

export interface StreamInterface<T> {
  map<R>(callback: UnaryFunction<T, R>): StreamInterface<T>;
  reduce<R>(identity: R, callback: ReducerFunc<T, R>): R;
  filter(callback: FilterFunc<T>): StreamInterface<T>;
  firstOr<DType>(default_: DType): T | DType | undefined;
  take(n: number): StreamInterface<T>;
  skip(n: number): StreamInterface<T>;
  collect<R>(callback: CollectorFunc<T, R>): ReturnType<CollectorFunc<T, R>>;
  forEach(callback: UnaryFunction<T, void>): void;
  mapReduce<R, ReducerRType>(
    initialValue: ReducerRType,
    mapFunc: UnaryFunction<T, R>,
    reducerFunc: ReducerFunc<R, ReducerRType>
  ): ReducerRType;
}

export class Stream<T> implements StreamInterface<T> {
  private pipe: Function_[] = [];
  private limit!: number | undefined;
  private offset!: number | undefined;

  private constructor(
    private _source: IterableType<T>,
    private infinite: boolean = false
  ) {}

  static of<T>(source: IterableType<T>) {
    return new Stream(source);
  }

  static iterate<T>(seed: T, callback: UnaryFunction<T, T>) {
    const source = (function*() {
      yield seed;
      while (true) {
        seed = callback(seed);
        yield seed;
      }
    })();
    return new Stream(source, true);
  }

  static range(start: number, end: number, step: number = 1) {
    return Stream.iterate(start, x => x + (step ?? 1)).take(end - start);
  }

  private _throwIfUnsafe() {
    if (this.infinite) {
      throw new Error(
        'Stream source is unsafe, stream is infinite call take(n) to process finite number of source items'
      );
    }
  }

  mapReduce<R, ReducerRType>(
    initial: ReducerRType,
    mapFunc: UnaryFunction<T, R>,
    reducerFunc: ReducerFunc<R, ReducerRType>
  ) {
    this._throwIfUnsafe();
    let result = initial;
    const composedFunc = compose<T, ReducerRType>(...this.pipe, source =>
      typeof source !== 'undefined'
        ? compose(
            (source: T) => mapFunc(source),
            (source: R) => reducerFunc(result, source)
          )(source)
        : undefined
    );
    for (const value of this.__offset().__limit()._source) {
      result = composedFunc(value);
    }
    return result;
  }

  map<R>(callback: UnaryFunction<T, R>): StreamInterface<T> {
    this.pipe = [
      ...this.pipe,
      source => (typeof source !== 'undefined' ? callback(source) : undefined),
    ];
    return this;
  }

  reduce<R>(identity: R, callback: ReducerFunc<T, R>): R {
    this._throwIfUnsafe();
    let result = identity;
    const composedFunc = compose<T, R>(...this.pipe, current => {
      if (typeof current !== 'undefined') {
        result = callback(result, current);
      }
      return result;
    });
    for (const value of this.__offset().__limit()._source) {
      result = composedFunc(value);
    }
    return result;
  }

  filter(callback: FilterFunc<T>): StreamInterface<T> {
    this.pipe = [
      ...this.pipe,
      source => (callback(source) ? source : undefined),
    ];
    return this;
  }

  firstOr<DType>(_default: DType): T | DType | undefined {
    const composedFunc = compose<T, T | DType>(...this.pipe);
    const result = (function*(source: IterableType<T>) {
      for (const value of source) {
        const _value = composedFunc(value);
        if (typeof _value !== 'undefined') {
          yield _value;
          return;
        }
      }
      yield undefined;
    })(this.__offset().__limit()._source);
    return (result.next().value as T | DType) ?? _default;
  }

  take(n: number): StreamInterface<T> {
    this.infinite = false;
    this.limit = n;
    return this;
  }

  skip(n: number): StreamInterface<T> {
    this.offset = n;
    return this;
  }

  collect<R>(collector: CollectorFunc<T, R>): ReturnType<CollectorFunc<T, R>> {
    this._throwIfUnsafe();
    function* gen(source: Iterable<T>, pipe: Function_[]) {
      const composedFunc = compose<T, any>(...pipe);
      for (const value of source) {
        const result = composedFunc(value);
        if (typeof result !== 'undefined') {
          yield result;
        }
      }
    }
    return collector(gen(this.__offset().__limit()._source, this.pipe));
  }

  forEach(callback: UnaryFunction<T, void>): void {
    this._throwIfUnsafe();
    const composedFunc = compose<T, void>(...this.pipe, current => {
      if (typeof current !== 'undefined') {
        callback(current);
      }
    });
    for (const value of this.__offset().__limit()._source) {
      composedFunc(value);
    }
  }

  private __offset() {
    if (this.offset) {
      this._source = (function*(source: Iterable<T>, length: number) {
        let index = 0;
        for (const value of source) {
          index++;
          if (index <= length) continue;
          yield value;
        }
      })(this._source, this.offset);
    }
    return this;
  }

  private __limit() {
    if (this.limit) {
      this._source = (function*(source: Iterable<T>, length: number) {
        let index = 0;
        for (const value of source) {
          index++;
          if (index > length) break;
          yield value;
        }
      })(this._source, this.limit);
    }
    return this;
  }
}
