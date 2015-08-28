import { default as test } from 'tape';
import Pathwise from './';
import { default as level } from 'memdb';

test('Pathwise', t => {
  t.throws(() => {
    new Pathwise();
  });
  t.ok(new Pathwise(level()));

  t.test('#put(path, obj, fn)', t => {
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

