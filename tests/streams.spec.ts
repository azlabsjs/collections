import { Stream, ListCollector } from '../src';

describe('Stream data structure tests', () => {
  it('create an array equals to [0, 1, 2, 3, 4] when ListCollector is passed as argument to stream.collect()', () => {
    const stream = Stream.range(0, 5);
    expect(stream.collect(ListCollector)).toEqual([0, 1, 2, 3, 4]);
  });

  it('should return integers less than 10 that are divisible by 2', () => {
    const stream = Stream.range(0, 10)
      .filter((v) => v % 2 === 0)
      .map((v) => `${v}`);
    expect(stream.collect(ListCollector)).toEqual(['0', '2', '4', '6', '8']);
  });

  it('should return sum of integers less than 10', () => {
    const result = Stream.range(0, 10).reduce(0, (p, c) => {
      p += c;
      return p;
    });
    expect(result).toEqual(45);
  });
});
