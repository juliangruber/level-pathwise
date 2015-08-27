
# level-pathwise

  Work In Progress,

  Nested storage engine

## Example

```js
import Pathwise from './';
import { default as level } from 'level';

const db = level('db');
const store = new Pathwise(db);

store.put({
  foo: {
    bar: ['beep', 'boop']   
  }
}, err => {
  if (err) throw err;
  dump(db, () => {
    store.get([], console.log);

    // => { "foo": { "bar": { "0": "beep", "1": "boop" } } }
  });
});
```

## Installation

```bash
$ npm install level-pathwise
```

## License

  MIT

