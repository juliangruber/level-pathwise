
# level-pathwise

  Work In Progress,

  Nested storage engine, basically letting you treat your leveldb like one big object which you can select subjections of.

## Example

```js
import Pathwise from 'level-pathwise';
import { default as level } from 'level';

const store = new Pathwise(level('db'));

store.put({
  foo: {
    bar: ['beep', 'boop'],
    baz: 'bleep'  
  }
}, err => {
  store.get([], (err, obj) => {
    // obj => {"foo":{"bar":{"0":"beep","1":"boop"},"baz":"bleep"}}

    store.del(['foo', 'bar'], err => {
      store.get([], (err, obj) => {
        // obj => {"foo":{"baz":"bleep"}}

        store.children([], console.log);
        // => ['foo']

        store.get(['foo', 'baz'], (err, obj) => {
          // obj => "bleep"

          store.batch([
            { type: 'put', data: { i: said: { what: 'what' } } },
            { type: 'del', path: ['foo'] }
          ], console.log);
        });
      });
    });
  });
});
```

## Installation

```bash
$ npm install level-pathwise
```

## API

### Pathwise(db)

  Instantiate a new pathwise store, using `db`.

### #get(path, fn)

  Get the object at `path` with all its children.

### #del(path, fn)

  Delete the object at `path` with all its children.

### #children(path, fn)

  Get the direct children of `path`.

### #batch(ops, fn)

  Execute multiple `get` and `del` operations in one atomic batch. `ops` is an array with objects of type

- `{ type: 'put', data: data }`
- `{ type: 'del', path: 'foo' }`

## License

  MIT

