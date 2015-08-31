import { default as test } from 'tape';
import Pathwise from './';
import { default as level } from 'memdb';

test('Pathwise', t => {
  t.throws(() => {
    new Pathwise();
  });
  t.ok(new Pathwise(level()));

  t.test('#put(path, obj, fn)', t => {
    t.test('object', t => {
      const p = new Pathwise(level());
      const o = { foo: 'bar', bar: 'baz' };
      p.put([], o, err => {
        t.error(err);
        p.get([], (err, obj) => {
          t.error(err);
          t.deepEqual(obj, o);
          t.end();
        });
      });
    });
    t.test('array', t => {
      const p = new Pathwise(level());
      const a = ['foo', 'bar'];
      p.put([], a, err => {
        t.error(err);
        p.get([], (err, array) => {
          t.error(err);
          t.deepEqual(array, a);
          t.end();
        });
      });
    });
    t.test('other', t => {
      const p = new Pathwise(level());
      p.put([], 3, err => {
        t.error(err);
        p.get([], (err, other) => {
          t.error(err);
          t.equal(other, 3);
          t.end();
        });
      });
    });
    t.test('integration', t => {
      const p = new Pathwise(level());
      const o = { foo: 'bar', bar: ['baz', { yo: 9 }] };
      p.put([], o, err => {
        t.error(err);
        p.get([], (err, obj) => {
          t.error(err);
          t.deepEqual(obj, o);
          t.end();
        });
      });
    })
    t.end();
  });

  t.test('#put(path, obj, { batch }, fn)', t => {
    const db = level();
    const p = new Pathwise(db);
    const b = db.batch();
    let nextTick = true;
    p.put([], { foo: 'bar', beep: 'boop' }, { batch: b }, err => {
      nextTick = false;
      t.error(err);
      t.deepEqual(b.ops, [
        { type: 'put', key: 'foo', value: 'bar' },
        { type: 'put', key: 'beep', value: 'boop' }
      ]);
      t.end();
    });
    t.ok(nextTick);
  });

  t.test('#batch(ops, fn)', t => {
    const p = new Pathwise(level());
    p.batch([{ type: 'put', path: [], data: 'hey' }], err => {
      t.error(err);
      p.get([], (err, data) => {
        t.error(err);
        t.equal(data, 'hey');

        p.batch([{ type: 'del', path: [] }], err => {
          t.error(err);
          p.get([], (err, data) => {
            t.error(err);
            t.deepEqual(data, {});
            t.end();
          });
        });
      });
    });
  });

  t.test('#get(path, fn)', t => {
    const p = new Pathwise(level());
    const o = { foo: { bar: 'baz' } };
    p.put([], o, err => {
      t.error(err);
      p.get([], (err, data) => {
        t.error(err);
        t.deepEqual(data, o);
        p.get(['foo'], (err, data) => {
          t.error(err);
          t.deepEqual(data, o.foo);
          p.get(['foo', 'bar'], (err, data) => {
            t.error(err);
            t.equal(data, o.foo.bar);
            t.end();
          });
        });
      });
    });
  });

  t.test('#del(path, fn)', t => {
    const p = new Pathwise(level());
    p.put([], { foo: { bar: 'baz', beep: 'boop' } }, err => {
      t.error(err);
      p.del(['foo', 'bar'], err => {
        t.error(err);
        p.get([], (err, data) => {
          t.error(err);
          t.deepEqual(data, { foo: { beep: 'boop' } });
          p.del([], err => {
            t.error(err);
            p.get([], (err, data) => {
              t.error(err);
              t.deepEqual(data, {});
              t.end();
            });
          });
        });
      });
    });
  });

  t.test('#del(path, { batch }, fn)', t => {
    const db = level();
    const p = new Pathwise(db);
    p.put([], { foo: 'bar', beep: 'boop' }, err => {
      t.error(err);

      const b = db.batch();
      let nextTick = true;
      p.del([], { batch: b }, err => {
        nextTick = false;
        t.deepEqual(b.ops, [
          { type: 'del', key: 'beep' },
          { type: 'del', key: 'foo' }
        ]);
        t.end();
      });
      t.ok(nextTick);
    });
  });

  t.test('#children(path, fn)', t => {
    t.end();
  });

  t.end();
});

