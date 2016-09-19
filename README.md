
# level-pathwise

  Turn a [leveldb](http://leveldb.org) into one huge object of arbitrary size! Efficiently and atomically update and read parts of it!

  [![build status](https://secure.travis-ci.org/juliangruber/level-pathwise.svg)](http://travis-ci.org/juliangruber/level-pathwise)

## Example

```js
var Pathwise = require('level-pathwise');
var level = require('level');

var store = new Pathwise(level('db'));

// insert an object on the root level

store.put([], {
  foo: {
    bar: ['beep', 'boop'],
    baz: 'bleep'  
  }
}, function(err){});

// read it out

store.get([], function(err, obj){
  // => {
  //      foo: {
  //        bar: ['beep', 'boop'],
  //        baz: 'bleep'  
  //      }
  //    }
});

// read only a subsection of the object,
// like data.foo.bar

store.get(['foo', 'bar'], function(err, obj){
  // => ['beep', 'boop']
});

// extend an object,
// like data.foo.key = 'value'

store.put([], {
  foo: {
    key: 'value'
  }
})

// read the direct children of a path

store.children(['foo'], function(err, children){
  // => ['bar', 'baz']
});

// remove some data,
// like delete data.foo.baz

store.del(['foo', 'baz'], function(err){});

// perform several updates in one atomic step,
// like data.i.said.what = 'what'; delete data.foo;

store.batch([
  { type: 'put', path: [], data: { i: said: { what: 'what' } } },
  { type: 'del', path: ['foo'] }
], function(){});
```

## Installation

```bash
$ npm install level-pathwise
```

## API

### Pathwise(db)

  Instantiate a new pathwise store, using `db`.

### #put(path, object[, opts], fn)

  Store `object` at `path`.

  Options:

  - `batch`: LevelUP batch object to use

### #get(path, fn)

  Get the object at `path` with all its children.

### #del(path[, opts], fn)

  Delete the object at `path` with all its children.

  Options:

  - `batch`: LevelUP batch object to use

### #children(path, fn)

  Get the direct children of `path`.

### #batch(ops, fn)

  Execute multiple `get` and `del` operations in one atomic batch. `ops` is an array with objects of type

- `{ type: 'put', path: path, data: data }`
- `{ type: 'del', path: path }`

## License

  MIT
