const { contractConfig } = require('./ethConfig.js')
const Web3 = require("web3");
const BigNumber = require('bn.js')
const { GetProof } = require('eth-proof');
const { encode } = require('eth-util-lite');

class EthBridge {
    constructor(bridgeAddress) {
        const web3 = new Web3(window.ethereum)
        this.web3 = web3

        let bridgeJson = require("./RainbowWars.json")
        this.bridgeAddress = bridgeAddress
        this.bridgeContract = new web3.eth.Contract(bridgeJson.abi, bridgeAddress)
        this.tokenAddress = "";
        this.bridgeJson = bridgeJson

        this.gp = new GetProof(contractConfig.ethNodeUrl)
    }

    async login() {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
        this.setUserAddress(accounts[0]);
        
        this.tokenAddress = await this.getBridgeToken();
        let tokenJson = require("./BridgedToken.json")
        this.tokenContract = new this.web3.eth.Contract(tokenJson.abi, this.tokenAddress)
        return accounts[0];
        //const tx = await this.attack(1, "lee.testnet");
        //return this.getProof(tx);
    }

    async logout(){}

    getTokenBalance(){
        return this.tokenContract.methods.balanceOf(this.userAddress).call();
    }

    getBridgeToken(){
        return this.bridgeContract.methods.rewardsToken().call();
        //return resp;
    }

    setUserAddress(address) {
        this.userAddress = address
    }

    async attack(value, beneficiary){
        const hexaddr = this.web3.utils.keccak256(beneficiary);
        let options = await this._getUserOption();
        const resp = await this.bridgeContract.methods.attack(hexaddr).send({...options, value});
        return resp.transactionHash;
    }

    async deal(){
        let options = await this._getUserOption();
        const resp = await this.bridgeContract.methods.deal().send({...options});
        return resp.transactionHash;
    }

    async getProof(txHash) {
        let resp = await this.gp.receiptProof(txHash)

        let rawReceipt = await this.web3.eth.getTransactionReceipt(txHash)
        let blockHash = rawReceipt.blockHash.replace("0x", "")
        return {
            blockHash: Buffer.from(blockHash, 'hex'),
            roothash: resp.header.receiptRoot,
            mptkey: encode(parseInt(resp.txIndex)),
            proof: encode(resp.receiptProof)
        }
    }

    async handleProof(proofData) {
        let options = await this._getUserOption()
        let resp = await this.bridgeContract.methods.ExecProof(proofData, 1)
            .send(options)
        return resp.transactionHash
    }

    async _getUserOption() {
        const gasPrice = await this._estimateGasPrice()
        const gasLimit = this._getGasLimit()
        return {
            from: this.userAddress,
            gas: gasLimit,
            gasPrice: gasPrice,
        }
    }

    async _estimateGasPrice() {
        let rawPrice = await this.web3.eth.getGasPrice()
        let parsed = new BigNumber(rawPrice)
        let multiplier = new BigNumber(4)
        return (parsed * multiplier).toString()
    }

    _getGasLimit() {
        return contractConfig.ethGasLimit
    }
}

export const eBridge = new EthBridge(contractConfig.ethBridge);

window.eBridge = eBridge;



