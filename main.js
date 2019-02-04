const SHA256 = require('crypto-js/sha256')

class Transaction{
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
  }

  mineBlock(difficulty) {
    let numberAttempts = 0
    while (this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++; 
      numberAttempts++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined after ${numberAttempts} attempts: `, this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 2
    this.pendingTransactions = []
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("01/01/2019", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions)
    block.mineBlock(this.difficulty)

    console.log('Block successfully mined!')
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null,miningRewardAddress, this.miningReward)
    ]
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance
  }

  isChainValid() {
    for (let i = 1; i<this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i-1]
      if(currentBlock.hash !== currentBlock.calculateHash()) return false
      if (currentBlock.previousHash !== previousBlock.hash) return false
    }
    return true
  }
}

let myCoin = new Blockchain();


myCoin.createTransaction(new Transaction('address 1', 'address 2', 100))
myCoin.createTransaction(new Transaction('address 2', 'address 1', 25))

console.log('Starting the miner....')
myCoin.minePendingTransactions('anthonys address')

console.log('Starting the miner again....')
myCoin.minePendingTransactions('anthonys address')

console.log('Anthonys balance is...', myCoin.getBalanceOfAddress('anthonys address'))
console.log('address 1 balance is...', myCoin.getBalanceOfAddress('address 1'))
console.log('address 2 balance is...', myCoin.getBalanceOfAddress('address 2'))
