import { contractCall,getReceiptProof } from './relay';
import { nearSDK } from './nearInit';

window.bf = Buffer.from

const bs64 = require('bs64')
const u8arrayToB64 = (a)=>bs64.encode(a.reduce((r,e)=>r.concat(e), []));

class NearBirdge {
    nearSDK = nearSDK;
    bridgeAddress = nearSDK.config.contractName;
    userAccount = "";

    async login(){
        this.userAccount = await this.nearSDK.login();
        return this.userAccount;
    }

    logout(){
        this.userAccount = "";
        this.nearSDK.logout();
    }

    deal() {
        return contractCall(this.nearSDK.contract, 'deal');
    }

    attack(value, beneficiary) {
        if(beneficiary.startsWith('0x')) beneficiary = beneficiary.slice(2);
        const hex = Buffer.from(beneficiary, 'hex');
        const hex32 = Buffer.alloc(32, 0);
        hex32.set(hex, hex32.length - hex.length);
        const b64addr = u8arrayToB64(hex32);
        console.log(b64addr);
        return contractCall(this.nearSDK.contract, 'attack', {beneficiary:b64addr});
    }

    handleProof(args){
        const args64 = {
            blockHash: u8arrayToB64(args.blockHash),
            roothash: u8arrayToB64(args.roothash),
            mptkey: u8arrayToB64(args.mptkey),
            proof: u8arrayToB64(args.proof)
        };
        //console.log(args64);
        return contractCall(this.nearSDK.contract, 'ExecProof', args64);
    }

    getProof(tx) {
        return getReceiptProof(this.nearSDK.near, this.nearSDK.contract, tx);
    }


    getTokenBalance(){
        return this.nearSDK.contract.balanceOf({tokenOwner:this.userAccount});
    }
}
export const nBridge = new NearBirdge();
window.nBridge = nBridge;