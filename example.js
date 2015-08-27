import Pathwise from './';
import { default as level } from 'level';
import { default as bytewise } from 'bytewise';

const db = level('db');
const store = new Pathwise(db);

store.put({
  foo: {
    bar: ['beep', 'boop']   
  }
}, err => {
  if (err) throw err;
  dump(db, () => {
    store.get([], console.log);
  });
});

function dump(db, fn){
  db.createReadStream({
    keyEncoding: bytewise,
    valueEncoding: 'json'
  })
  .on('data', console.log)
  .on('end', fn);
}
