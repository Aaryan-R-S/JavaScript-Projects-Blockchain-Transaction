const SHA256 = require('crypto-js/sha256')

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block{
    constructor(timestamp, transactions, previoushash){
        this.timestamp = timestamp
        this.transactions = transactions 
        this.previoushash = previoushash
        this.hash = this.calculateHash()
        this.nonce = 0
    }
    calculateHash(){
        return SHA256(this.previoushash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
    }
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty+1).join("0")){
            this.nonce ++
            this.hash = this.calculateHash()
        }
        console.log("Block mined: " + this.hash);
    }   
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 23
    }
    createGenesisBlock(){
        return new Block("01/01/2020", "Genesis Block", "0")
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        this.pendingTransactions.push(new Transaction(null, miningRewardAddress, this.miningReward))
        block.mineBlock(this.difficulty)
        console.log(" Block Successfully Mined!");
        this.chain.push(block)
        this.pendingTransactions = []
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }
    getBalanceOfAddress(address){
        let balance = 0
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance -= trans.amount
                }
                if(trans.toAddress == address){
                    balance += trans.amount
                }
            }
        }
        return balance
    }
    isChainValid(){
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false
            }
            if(currentBlock.previoushash != previousBlock.hash){
                return false
            }
        }
        return true
    }
}



let arsCoins = new Blockchain()

// Transaction 1 --
arsCoins.createTransaction(new Transaction('address1', 'address2', 100))
console.log("\n Starting the Mining of Block 1...")

arsCoins.minePendingTransactions('miner1')
console.log("\n Balance of Address1 is", arsCoins.getBalanceOfAddress('address1'));
console.log("\n Balance of Address2 is", arsCoins.getBalanceOfAddress('address2'));
console.log("\n Balance of Miner1 is", arsCoins.getBalanceOfAddress('miner1'));

// Transaction 2 --
arsCoins.createTransaction(new Transaction('address2', 'address1', 100))
console.log("\n Starting the Mining of Block 2...")

arsCoins.minePendingTransactions('miner1')
console.log("\n Balance of Address1 is", arsCoins.getBalanceOfAddress('address1'));
console.log("\n Balance of Address2 is", arsCoins.getBalanceOfAddress('address2'));
console.log("\n Balance of Miner1 is", arsCoins.getBalanceOfAddress('miner1'));

// See Block Chain --
console.log(JSON.stringify(arsCoins, null, 4))
console.log(arsCoins.chain);

// Verify the Chain --
console.log("Is blockchain Valid? " + arsCoins.isChainValid());
arsCoins.chain[1].transactions[0].amount = 1
arsCoins.chain[1].hash = arsCoins.chain[1].calculateHash()
console.log("Is blockchain Valid? " + arsCoins.isChainValid());

