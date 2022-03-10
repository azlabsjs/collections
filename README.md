# Documentation

Collection

## Usage

- Create a collection instance

```ts
const collection = new Collection<number, string>();
```

- Add an element to the collection with index = 1

```ts
collection.add(1, 'Hello World!');
```

- Create an internal 0 based index collection

```ts
const collection = collect<number, string>(['Hello World!']);
```

- To empty the collection container

```ts
collection.clear();
```

- To return false for missing key

```ts
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

collection.contains('en-US')

collection.contains('ch-CH')
```

- To returns the total elements in the collection

```ts
collection.count()

collection.size()
```


