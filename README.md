
# level-pathwise

  Work In Progress,

  Nested storage engine

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
});
```

## Installation

```bash
$ npm install level-pathwise
```

## License

  MIT

