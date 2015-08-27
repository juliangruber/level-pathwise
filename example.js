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
  dump(db);
});

function dump(db){
  db.createReadStream({
    keyEncoding: bytewise
  }).on('data', console.log)
}
