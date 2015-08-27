import Pathwise from './';
import { default as level } from 'level';

const db = level('db');
const store = new Pathwise(db);

store.put({
  foo: {
    bar: ['beep', 'boop']   
  }
}, err => {
  if (err) throw err;

  store.get([], (err, obj) => {
    if (err) throw err;
    
    console.log(obj);
    store.get(['foo', 'bar'], (err, obj) => {
      if (err) throw err;

      console.log(obj);
    });
  });
});
