var test = require('tape');
var Pathwise = require('./');
var level = require('level-mem');
var bytewise = require('bytewise');

test('Pathwise', function(t){
  t.throws(function(){
    new Pathwise();
  });
  t.ok(new Pathwise(level()));

  t.test('#put(path, obj, fn)', function(t){
    t.test('object', function(t){
      var p = new Pathwise(level());
      var o = { foo: 'bar', bar: 'baz' };
      p.put([], o, function(err){
        t.error(err);
        p.get([], function(err, obj){
          t.error(err);
          t.deepEqual(obj, o);
          t.end();
        });
      });
    });
    t.test('array', function(t){
      var p = new Pathwise(level());
      var a = ['foo', 'bar'];
      p.put([], a, function(err){
        t.error(err);
        p.get([], function(err, array){
          t.error(err);
          t.deepEqual(array, a);
          t.end();
        });
      });
    });
    t.test('other', function(t){
      var p = new Pathwise(level());
      p.put([], 3, function(err){
        t.error(err);
        p.get([], function(err, other){
          t.error(err);
          t.equal(other, 3);
          t.end();
        });
      });
    });
    t.test('integration', function(t){
      var p = new Pathwise(level());
      var o = { foo: 'bar', bar: ['baz', { yo: 9 }] };
      p.put([], o, function(err){
        t.error(err);
        p.get([], function(err, obj){
          t.error(err);
          t.deepEqual(obj, o);
          t.end();
        });
      });
    });
    t.test('extend', function(t){
      var p = new Pathwise(level());
      p.put([], { foo: { hi: 'you' } }, function(err){
        t.error(err);
        p.put([], { foo: { beep: 'boop' } }, function(err){
          t.error(err);
          p.get([], function(err, obj){
            t.error(err);
            t.deepEqual(obj, {
              foo: {
                hi: 'you',
                beep: 'boop'
              }
            });
            t.end();
          });
        });
      });
    });
    t.end();
  });

  t.test('#put(path, obj, { batch }, fn)', function(t){
    var db = level();
    var p = new Pathwise(db);
    var b = db.batch();
    var nextTick = true;
    p.put([], { foo: 'bar', beep: 'boop' }, { batch: b }, function(err){
      nextTick = false;
      t.error(err);
      t.deepEqual(b.ops, [
        { type: 'put', key: bytewise.encode(['foo']), value: JSON.stringify('bar') },
        { type: 'put', key: bytewise.encode(['beep']), value: JSON.stringify('boop') }
      ]);
      t.end();
    });
    t.ok(nextTick);
  });

  t.test('#batch(ops, fn)', function(t){
    var p = new Pathwise(level());
    p.batch([{ type: 'put', path: [], data: 'hey' }], function(err){
      t.error(err);
      p.get([], function(err, data){
        t.error(err);
        t.equal(data, 'hey');

        p.batch([{ type: 'del', path: [] }], function(err){
          t.error(err);
          p.get([], function(err, data){
            t.error(err);
            t.deepEqual(data, {});
            t.end();
          });
        });
      });
    });
  });

  t.test('#get(path, fn)', function(t){
    var p = new Pathwise(level());
    var o = { foo: { bar: 'baz' } };
    p.put([], o, function(err){
      t.error(err);
      p.get([], function(err, data){
        t.error(err);
        t.deepEqual(data, o);
        p.get(['foo'], function(err, data){
          t.error(err);
          t.deepEqual(data, o.foo);
          p.get(['foo', 'bar'], function(err, data){
            t.error(err);
            t.equal(data, o.foo.bar);
            t.end();
          });
        });
      });
    });
  });

  t.test('#del(path, fn)', function(t){
    var p = new Pathwise(level());
    p.put([], { foo: { bar: 'baz', beep: 'boop' } }, function(err){
      t.error(err);
      p.del(['foo', 'bar'], function(err){
        t.error(err);
        p.get([], function(err, data){
          t.error(err);
          t.deepEqual(data, { foo: { beep: 'boop' } });
          p.del([], function(err){
            t.error(err);
            p.get([], function(err, data){
              t.error(err);
              t.deepEqual(data, {});
              t.end();
            });
          });
        });
      });
    });
  });

  t.test('#del(path, { batch }, fn)', function(t){
    var db = level();
    var p = new Pathwise(db);
    p.put([], { foo: 'bar', beep: 'boop' }, function(err){
      t.error(err);

      var b = db.batch();
      var nextTick = true;
      p.del([], { batch: b }, function(err){
        nextTick = false;
        t.deepEqual(b.ops, [
          { type: 'del', key: bytewise.encode(['beep']) },
          { type: 'del', key: bytewise.encode(['foo']) }
        ]);
        t.end();
      });
      t.ok(nextTick);
    });
  });

  t.test('#children(path, fn)', function(t){
    var p = new Pathwise(level());
    p.put([], { foo: { bar: 'baz' } }, function(err){
      t.error(err);
      p.children([], function(err, children){
        t.error(err);
        t.deepEqual(children, ['foo']);
        p.children(['foo'], function(err, children){
          t.error(err);
          t.deepEqual(children, ['bar']);
          p.children(['foo', 'bar'], function(err, children){
            t.error(err);
            t.deepEqual(children, ['baz']);
            t.end();
          });
        });
      });
    });
  });

  t.end();
});
