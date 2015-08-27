import assert from 'assert';
import { default as defaults } from 'levelup-defaults';
import { default as bytewise } from 'bytewise';
import { default as type } from 'component-type';
import { default as after } from 'after';
import collect from 'collect-stream';
import { default as deleteRange } from 'level-delete-range';

export default class Pathwise {
  constructor(db) {
    assert(db, 'db required');
    this._db = defaults(db, {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    });
  }
  put(obj, fn) {
    var batch = this._db.batch();
    this._write(batch, [], obj, fn);  
    batch.write(fn);
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
  get(path, fn) {
    var ret = {};
    var el = ret;

    collect(this._db.createReadStream({
      start: path.concat(null),
      end: path.concat(undefined)
    }), (err, data) => {
      if (err) return fn(err);
      for (var kv of data) {
        var segs = kv.key.slice(path.length);
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
      }
      fn(null, ret);
    });
  }
  del(path, fn) {
    deleteRange(this._db, {
      start: path.concat(null),
      end: path.concat(undefined)
    }, fn);
  }
}

function arrToObj(arr){
  var obj = {};
  arr.forEach((el, idx) => {
    obj[idx] = el;
  });
  return obj;
}

