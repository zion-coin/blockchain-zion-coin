// @flow

interface Input {
  transactionHash: string,
  transactionIndex: number,
  unlockingScript: string,
  nonce: bigInt
}

interface Output {
  amount: bigInt,
  lockingScript: string
}

interface Transaction {
  version: string,
  inputs: Input,
  outputs: Output,
  locktime: Date
}
