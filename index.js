import assert from 'assert';
import { default as defaults } from 'levelup-defaults';
import { default as bytewise } from 'bytewise';
import { default as type } from 'component-type';
import { default as after } from 'after';

export default class Pathwise {
  constructor(db) {
    assert(db, 'db required');
    this._db = defaults(db, {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    });
  }
  put(obj, fn) {
    this._put([], obj, fn);  
  }
  _put(key, obj, fn) {
    switch(type(obj)) {
      case 'object':
        const keys = Object.keys(obj);
        const next = after(keys.length, fn);
        keys.forEach(k => {
          this._put(key.concat(k), obj[k], next);
        });
        break;
      case 'array':
        this._put(key, arrToObj(obj), fn);
        break;
      default:
        this._db.put(key, obj, fn);
        break;
    }
  }
}

function arrToObj(arr){
  var obj = {};
  arr.forEach((el, idx) => {
    obj[idx] = el;
  });
  return obj;
}

