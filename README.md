# Documentation

Collection is an utility class for manipulating javascript collection.
It offers various methods to serve this purpose.
Below you will find some information on how to perform common tasks.

## Usage

> First, import collect and Collection in the beginning of your file :

```ts
import { collect, Collection } from '@azlabsjs/collections';
```

### Return an empty array

```ts
const values = collection.values();
```

### Create a collection instance

```ts
const collection = new Collection<number, string>();
```

### Add an element to the collection with index = 1

```ts
const collection = new Collection<number, string>();
// Add an element to the collection
collection.add(1, 'Hello World!');
```

### Create an internal 0 based index collection

```ts
// Creates a collection using the collect function
const collection = collect<number, string>(['Hello World!']);
```

### To empty the collection container

```ts
// Removes all elements from the collection
collection.clear();
```

### To return false for missing key

```ts
// Collect an array of JS object using the user provided key
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

const result = collection.contains('en-US'); // returns true

const result2 = collection.contains('ch-CH'); // return false
```

### To returns the total elements in the collection

```ts
// Returns the total items in the collection
collection.count();

// Returns the total items in the collection
collection.size();
```
