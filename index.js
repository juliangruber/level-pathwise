import assert from 'assert';
import { default as defaults } from 'levelup-defaults';
import { default as bytewise } from 'bytewise';
import { default as type } from 'component-type';
import { default as after } from 'after';
import { default as deleteRange } from 'level-delete-range';
import { default as streamToArray } from 'stream-to-array';

export default class Pathwise {
  constructor(db) {
    assert(db, 'db required');
    this._db = defaults(db, {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    });
  }
  put(path, obj, opts, fn) {
    if (typeof opts == 'function') [opts, fn] = [{}, opts];
    const batch = opts.batch || this._db.batch();
    this._write(batch, path, obj, fn);  
    if (opts.batch) setImmediate(fn);
    else batch.write(fn);
  }
  _write(batch, key, obj, fn) {
    switch(type(obj)) {
      case 'object':
        const keys = Object.keys(obj);
        const next = after(keys.length, fn);
        keys.forEach(k => {
          this._write(batch, key.concat(k), obj[k], next);
        });
        break;
      case 'array':
        this._write(batch, key, arrToObj(obj), fn);
        break;
      default:
        batch.put(key, obj);
        break;
    }
  }
  batch(ops, fn) {
    const batch = this._db.batch();
    const next = after(ops.length, err => {
      if (err) return fn(err);
      batch.write(fn);
    });
    ops.forEach(op => {
      if (op.type == 'put') this.put(op.path, op.data, { batch: batch }, next);
      else if (op.type == 'del') this.del(op.path, { batch: batch }, next);
    });
  }
  get(path, fn) {
    let ret = {};
    let el = ret;

    streamToArray(this._db.createReadStream({
      start: path,
      end: path.concat(undefined)
    }), (err, data) => {
      if (err) return fn(err);

      data.forEach((kv) => {
        const segs = kv.key.slice(path.length);
        if (segs.length) {
          segs.forEach((seg, idx) => {
            if (!el[seg]) {
              if (idx == segs.length - 1) {
                el[seg] = kv.value;
              } else {
                el[seg] = {};
              }
            }
            el = el[seg];
          });
          el = ret;
        } else {
          ret = kv.value;
        }
      });
      fn(null, ret);
    });
  }
  del(path, opts, fn) {
    if (typeof opts == 'function') [opts, fn] = [{}, opts];
    const batch = opts.batch || this._db.batch();

    streamToArray(this._db.createKeyStream({
      start: path,
      end: path.concat(undefined)
    }), (err, keys) => {
      if (err) return fn(err);
      keys.forEach(key => batch.del(key));
      if (opts.batch) fn();
      else batch.write(fn);
    });
  }
  children(path, fn) {
    streamToArray(this._db.createReadStream({
      start: path,
      end: path.concat(undefined)
    }), (err, kv) => {
      if (err) return fn(err);
      fn(null, kv.map(_kv => {
        return _kv.key[path.length] || _kv.value;
      }));
    });
  }
}

function arrToObj(arr){
  var obj = {};
  arr.forEach((el, idx) => {
    obj[idx] = el;
  });
  return obj;
}

