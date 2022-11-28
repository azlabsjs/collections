import { JSArray } from '../src/arrays';
import { ListCollector, Stream } from '../src/streams';

describe('JsArray methods tests', () => {
  it('should returns the [...].filter(fn) when JsArray.filter(fn) is called!', () => {
    expect(
      JSArray.filter(
        Stream.iterate(0, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        (x) => x % 2 === 0
      )
    ).toEqual(
      Stream.iterate(0, (x) => x + 1)
        .take(10)
        .collect(ListCollector)
        .filter((x) => x % 2 === 0)
    );

    expect(
      JSArray.filter(
        Stream.iterate(0, (x) => x + 1)
          .take(10)
          .collect(ListCollector)
          .map((x) => ({
            value: x,
            has: function (key: 'value', value: number[]): boolean {
              return value.includes(this[key] as number);
            },
          })),
        'value',
        [0, 2, 4, 6, 8]
      ).map((x) => x.value)
    ).toEqual(
      Stream.iterate(0, (x) => x + 1)
        .take(10)
        .collect(ListCollector)
        .filter((x) => x % 2 === 0)
    );
  });

  it('should returns the JSArray.chunk(T[], 3) to create a zip of 3 items each', () => {
    const chunks = JSArray.chunk(
      Stream.iterate(0, (x) => x + 1)
        .take(10)
        .collect(ListCollector),
      3
    );
    expect(chunks[0]).toEqual([0, 1, 2]);
    expect(chunks[1]).toEqual([3, 4, 5]);
    expect(chunks[2]).toEqual([6, 7, 8]);
    expect(chunks[3]).toEqual([9]);
  });

  it('should returns "Hola!" when JSArray.sort() is called on the tested list', () => {
    const list = [
      {
        lang: 'en-US',
        greetings: 'Hi!',
      },
      {
        lang: 'fr-FR',
        greetings: 'Salut!',
      },
      {
        lang: 'es-ES',
        greetings: 'Hola!',
      },
    ];
    const result = JSArray.sort(list, 'lang', 1);
    expect(result[0].greetings).toEqual('Hi!');
    expect(JSArray.sort(list, ['lang', 'greetings'], -1)[0].lang).toEqual(
      'en-US'
    );
    expect(JSArray.sort([1, 2, 3, 4, 5], (a, b) => (a > b ? -1 : 1))).toEqual([
      5, 4, 3, 2, 1,
    ]);
    expect(JSArray.sort([1, 2, 3, 4, 5], undefined, -1)).toEqual([
      5, 4, 3, 2, 1,
    ]);
    expect(JSArray.sort([], undefined, -1)).toEqual([]);
    expect(
      JSArray.sort(
        [
          {
            date: '2020-02-15 13:47:00',
          },
          {
            date: '2020-02-17 10:05:00',
          },
          {
            date: '2020-02-16 00:00:00',
          },
        ],
        'date',
        -1
      )
    ).toEqual([
      {
        date: '2020-02-17 10:05:00',
      },
      {
        date: '2020-02-16 00:00:00',
      },
      {
        date: '2020-02-15 13:47:00',
      },
    ]);
  });

  it('should convert the chunked list to a flat list', () => {
    const list = Stream.iterate(0, (x) => x + 1)
      .take(10)
      .collect(ListCollector);
    const chunks = JSArray.chunk(list, 3);
    const out: Array<number[][]> = [];
    for (const chunk of chunks) {
      out.push(JSArray.chunk(chunk, 2));
    }
    expect(JSArray.flatten(out)).toEqual(
      Stream.iterate(0, (x) => x + 1)
        .take(10)
        .collect(ListCollector)
    );
  });

  it('should return [1,2,3,4,5] when call take(5) on [1,2,3,4,5,6,7,8,9,10]', () => {
    expect(
      JSArray.take(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        5
      )
    ).toEqual(
      Stream.iterate(1, (x) => x + 1)
        .take(5)
        .collect(ListCollector)
    );
  });

  it('should return [6,7,8,9,10] when call JSArray.skip(5) on [1,2,3,4,5,6,7,8,9,10]', () => {
    expect(
      JSArray.skip(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        5
      )
    ).toEqual(
      Stream.iterate(1, (x) => x + 1)
        .skip(5)
        .take(5)
        .collect(ListCollector)
    );
  });

  it('should return true only if two array contains the same values', () => {
    expect(
      JSArray.equals(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector)
      )
    ).toBe(true);

    expect(
      JSArray.equals(
        Stream.iterate(1, (x) => x + 1)
          .skip(10)
          .take(10)
          .collect(ListCollector),
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector)
      )
    ).toBe(false);
  });

  it('should return [4,5,6] for JSArray.intersect([1,2,3,4,5,6], [4,5,6,7,8,9,10])', () => {
    expect(
      JSArray.intersect(
        Stream.iterate(1, (x) => x + 1)
          .take(6)
          .collect(ListCollector),
        Stream.iterate(1, (x) => x + 1)
          .skip(3)
          .take(7)
          .collect(ListCollector)
      )
    ).toEqual([4, 5, 6]);
  });

  it('should return false if source list is smaller that the sublist', () => {
    expect(
      JSArray.containsAll(
        Stream.iterate(1, (x) => x + 1)
          .take(6)
          .collect(ListCollector),
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector)
      )
    ).toEqual(false);

    expect(
      JSArray.containsAll(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        Stream.iterate(1, (x) => x + 1)
          .take(6)
          .collect(ListCollector)
      )
    ).toEqual(true);
  });

  it('should return non event numbers for JSArray.reject(number[], x => x % 2 === 0)', () => {
    expect(
      JSArray.reject(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        (x) => x % 2 === 0
      )
    ).toEqual([1, 3, 5, 7, 9]);
  });

  it('should return [10,11,12,13,14,15] for JSArray.diff([1...9], [1...15])', () => {
    expect(
      JSArray.diff(
        Stream.iterate(1, (x) => x + 1)
          .take(9)
          .collect(ListCollector),
        Stream.iterate(1, (x) => x + 1)
          .take(15)
          .collect(ListCollector)
      )
    ).toEqual([10, 11, 12, 13, 14, 15]);

    expect(
      JSArray.symetricDiff(
        Stream.iterate(1, (x) => x + 1)
          .take(9)
          .collect(ListCollector),
        Stream.iterate(1, (x) => x + 1)
          .take(15)
          .collect(ListCollector)
      )
    ).toEqual([10, 11, 12, 13, 14, 15]);

    expect(
      JSArray.symetricDiff(
        Stream.iterate(1, (x) => x + 1)
          .take(15)
          .collect(ListCollector),
        Stream.iterate(1, (x) => x + 1)
          .take(9)
          .collect(ListCollector)
      )
    ).toEqual([10, 11, 12, 13, 14, 15]);
  });

  it('should return [10] for JSArray.last([1...10])', () => {
    expect(
      JSArray.last(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector)
      )
    ).toEqual(10);

    expect(JSArray.last([])).toEqual(undefined);
  });

  it('should return [2...10] for JSArray.tail([1...10])', () => {
    expect(
      JSArray.tail(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        3
      )
    ).toEqual([5, 6, 7, 8, 9, 10]);
  });

  it('should return true for JSArray.includes([1...10], 9)', () => {
    expect(
      JSArray.includes(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        9
      )
    ).toEqual(true);

    expect(
      JSArray.includes(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        11
      )
    ).toEqual(false);
  });

  it('should return true for JSArray.seqSearch([1...10], 9)', () => {
    expect(JSArray.seqSearch([], 9)).toEqual(false);
    expect(
      JSArray.seqSearch(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        9
      )
    ).toEqual(true);
    expect(
      JSArray.seqSearch(
        Stream.iterate(1, (x) => x + 1)
          .take(10)
          .collect(ListCollector),
        11,
        (x, y) => x === y
      )
    ).toEqual(false);
  });
});
