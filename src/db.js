// @flow
const levelup = require('levelup');
const db      = levelup('~/.zion-coin/db');

/****************************** NOTICE ********************************
  * In this case, we will be storing data using googles levelup
  * database. The key will be the blocks hash [doubleSha3(blockHeader)]
  * support for get, put, batch, del
  * blocks are stored as bencoded dictionary strings
  *********************************************************************/


class DB {
  constructor() {

  }

  put(hash: string, block: string): null | error {
    db.put(hash, block, (err) => {
      if (err) return err;
      return null;
    });
  }

  get(hash: string): null | string {
    db.get(hash, (err, value) => {
      if (err) return err;
      return (null, value);
    });
  }

  delete(hash: string): null | error {
    db.delete(hash, (err) => {
      if (err) return err;
      return null;
    })
  }

  // [ ['0x1a4...df2', { block data }], ['0xcb1...bb5', { block data }], ... ]
  batchPut(hashValuePairs: Array<Array<string>>) {
    hashes = hashes.map((hash) => {
      return { type: 'put', key: hash[0], value: hash[1] }
    });
    db.batch(hashes, (err) => {
      if (err) return err;
      return null;
    });
  }
}
