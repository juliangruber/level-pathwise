var Pathwise = require('./');
var level = require('level');

var db = level('db');
var store = new Pathwise(db);

store.put([], {
  foo: {
    bar: ['beep', 'boop'],
    baz: 'bleep'  
  }
}, function(err){
  if (err) throw err;

  store.get([], function(err, obj){
    if (err) throw err;
    
    console.log('=> %j', obj);

    store.del(['foo', 'bar'], function(err){
      if (err) throw err;

      store.get([], function(err, obj){
        if (err) throw err;

        console.log('=> %j', obj);

        store.get(['foo', 'baz'], function(err, obj){
          if (err) throw err;

          console.log('=> %j', obj);

          store.children(['foo', 'baz'], function(err, children){
            if (err) throw err;

            console.log('=> %j', children);

            store.children([], function(err, children){
              if (err) throw err;

              console.log('=> %j', children);

              store.batch([
                { type: 'put', path: [], data: { i: { said: { what: 'yo' } } } },
                { type: 'del', path: ['foo'] }
              ], function(err){
                if (err) throw err;

                store.get([], function(err, obj){
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
