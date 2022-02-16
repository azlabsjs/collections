import { collect, Collection } from '../src/collections';

describe('Collection Class Test', () => {
  it('should collection.values() should return an empty array', () => {
    const collection = collect([]);
    expect(collection.values()).toEqual([]);
  });

  it('collection.add() should add an element to the collection with index = 1', () => {
    const collection = new Collection<number, string>();
    collection.add(1, 'Hello World!');
    expect(collection.get(1)).toEqual('Hello World!');
  });

  it('collect() to create an internal 0 based index collection', () => {
    const collection = collect<number, string>(['Hello World!']);
    expect(collection.get(0)).toEqual('Hello World!');
  });

  it('Collection.clear() to empty the collection container', () => {
    const collection = collect<number, string>(['Hello World!']);
    collection.clear();
    expect(collection.get(0)).toEqual(undefined);
    expect(collection.values()).toEqual([]);
  });

  it('Collection.contains() to returns false for missing key', () => {
    const collection = collect<string, { [index: string]: any }>(
      [
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
      ],
      'lang'
    );
    expect(collection.contains('en-US')).toEqual(true);
    expect(collection.contains('ch-CH')).toEqual(false);
  });

  it('Collection.count() & Collection.size() to returns the total elements in the collection', () => {
    const collection = collect<string, { [index: string]: any }>(
      [
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
      ],
      'lang'
    );
    expect(collection.count()).toEqual(3);
    expect(collection.size()).toEqual(3);
  });
});
