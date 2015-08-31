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
    t.end();
  });

  t.test('#batch(ops, fn)', t => {
    t.end();
  });

  t.test('#get(path, fn)', t => {
    t.end();
  });

  t.test('#del(path, fn)', t => {
    t.end();
  });

  t.test('#del(path, { batch }, fn)', t => {
    t.end();
  });

  t.test('#children(path, fn)', t => {
    t.end();
  });

  t.end();
});

