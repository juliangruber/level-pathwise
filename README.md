
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
    bar: ['beep', 'boop']   
  }
}, err => {
  if (err) throw err;

  store.get([], console.log);
  // => { "foo": { "bar": { "0": "beep", "1": "boop" } } }

  store.get(['foo', 'bar'], console.log);
  // => { "0": "beep", "1": "boop" } 
});
```

## Installation

```bash
$ npm install level-pathwise
```

## License

  MIT

