import Pathwise from './';
import { default as level } from 'level';

const db = level('db');
const store = new Pathwise(db);

store.put([], {
  foo: {
    bar: ['beep', 'boop'],
    baz: 'bleep'  
  }
}, err => {
  if (err) throw err;

  store.get([], (err, obj) => {
    if (err) throw err;
    
    console.log('=> %j', obj);

    store.del(['foo', 'bar'], err => {
      if (err) throw err;

      store.get([], (err, obj) => {
        if (err) throw err;

        console.log('=> %j', obj);

        store.get(['foo', 'baz'], (err, obj) => {
          if (err) throw err;

          console.log('=> %j', obj);

          store.children(['foo', 'baz'], (err, children) => {
            if (err) throw err;

            console.log('=> %j', children);

            store.children([], (err, children) => {
              if (err) throw err;

              console.log('=> %j', children);

              store.batch([
                { type: 'put', path: [], data: { i: { said: { what: 'yo' } } } },
                { type: 'del', path: ['foo'] }
              ], err => {
                if (err) throw err;

                store.get([], (err, obj) => {
                  if (err) throw err;

                  console.log('=> %j', obj);
                });
              });
            });
          });
        });
      });
    });
  });
});
