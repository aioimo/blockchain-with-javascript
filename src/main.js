const {Blockchain, Transaction} = require('./blockchain')
const EC = require('elliptic').ec
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('25d1a1be2d72e6e3ece91c69abc43e2f5dc180e796afbd7c836875f5ae555016')
const myWalletAddress = myKey.getPublic('hex')

let myCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
myCoin.addTransaction(tx1)

console.log('Starting the miner....')
myCoin.minePendingTransactions(myWalletAddress)

console.log('Balance of myWallet: ', myCoin.getBalanceOfAddress(myWalletAddress))

myCoin.chain[1].transactions[0].amount = 1;

console.log('Balance of myWallet after fraudulent transaction: ', myCoin.getBalanceOfAddress(myWalletAddress))

console.log('Is Chain valid?', myCoin.isChainValid());
