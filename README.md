
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

## License

  MIT

