const bencode    = require('bencode');
const SHA3       = require('sha3');
const merkleTree = require('merkle-tree-zion-coin');
const miner      = require('miner-zion-coin');

/********************************************************************************************
  * STRCTURE OF A BLOCK
  * Size           Field                Description
  *
  * 4   bytes      Block Size           The size of the block, in bytes, following this field
  * 80  bytes      Block Header         Several fields form the block Header
  * 1-9 bytes      Transaction Counter  How many transactions follow
  * variable       Transactions
  *******************************************************************************************/

/****************************** NOTICE ********************************
  * In this case, we will be using an object rather than buffers.
  * To transmit and store the block, we will use a bencode
  * dictionary. Also included is the height of the block.
  *********************************************************************/

class Block {
  constructor(input) {
    const self = this;
    // decode the buffer
    if (typeof input === 'string')
      input = Buffer.from(input);
    input = bencode.decode(input, 'utf8');

    self.height       = input.height;
    self.blockHeader  = new blockHeader(input.blockHeader);
    self.transactions = input.transactions;
  }

  encodeBlock() {
    const self = this;

    return bencode.encode({
      blockSize:    self.blockSize,
      blockHeader:  self.blockHeader,
      transactions: self.transactions
    });
  }

  verify() {
    const self = this;
    // check the height is one greater than the parentBlock

    // check that the transaction size doesn't exceed '100'
    if (self.transactions > 100)
      return false;
    // check the merkle root
    if ( self.BlockHeader.merkleRoot !== new merkleTree(self.transactions) )
      return false;
    // check the timestamp is within a range of 2 hours from now
    let hours = Math.abs(Date.now() - self.timestamp) / 36e5; // 36e5 is the scientific notation for 60*60*1000 (nanoseconds)
    // check the difficulty is right

    // check the nonce is legitimate
    if (!miner.verify(self.transactions, self.difficulty, self.blockHeader.nonce))
      return false;

    return true;
  }
}

/******************************************************************************************************
  * STRCTURE OF A BLOCK HEADER
  * Size           Field             Description
  *
  * 4  bytes       Version           A version number to track software/protocol upgrades
  * 32 bytes       Parent Block      A reference to the hash of the previous (parent) block in the chain
  * 32 bytes       Merkle Root       A hash of the root of the merkle tree of this block's transactions
  * 4  bytes       Timestamp         The approximate creation time of this block (seconds from Unix Epoch)
  * 4  bytes       Diffuculty Target The proof-of-work algorithm diffuculty target for this block
  * 4  bytes       Nonce             A counter used for the proof-of-work algorithm
  ******************************************************************************************************/

class BlockHeader {
  constructor(input) {
    const self = this;

    self.version     = input.version;
    self.parentBlock = input.parentBlock;
    self.merkleRoot  = input.merkleRoot;
    self.timestamp   = input.timestamp;
    self.difficulty  = input.difficulty;
    self.nonce       = input.nonce;
  }
}

module.exports = {
  Block,
  BlockHeader
}

function doubleSha3(payload) {
  if (typeof payload === 'string')
    payload = Buffer.from(payload);

  return new SHA3.SHA3Hash()
                 .update(
                   new SHA3.SHA3Hash()
                           .update(payload)
                           .digest()
                 )
                 .digest('hex');
}
