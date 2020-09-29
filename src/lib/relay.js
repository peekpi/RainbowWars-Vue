import { borshifyOutcomeProof } from './borshify-proof';

const BN = require('bn.js')
const gas = new BN('300000000000000');
const amount = new BN(0);
export function contractCall(contract, method, args){
    return contract.account.functionCall(contract.contractId, method, args, gas, amount);
    /*
    return nearJsonContractFunctionCall(
        contract.contractId,
        contract.account,
        method,
        args,
        gas,
        amount);*/
}

async function nextBlockHash(near, blockhash) {
    const block = await near.connection.provider.block({blockId: blockhash});
    //await sleep(10);
    const nextBlock = await near.connection.provider.block({blockId: block.header.height+2});
    return nextBlock.header.hash;
}nextBlockHash;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getReceiptProof(near, contract, receipt) {
    const receipt_id = receipt.transaction_outcome.outcome.receipt_ids[0];
    const receiptBlockhash = receipt.transaction_outcome.block_hash;
    await sleep(2000);
    //const BlockHash = await nextBlockHash(near, receiptBlockhash);
    const nearSenderAccountId = contract.account.accountId;
    // WHY?
    let clientBlockHashB58 = receiptBlockhash //BlockHash; //r.transaction_outcome.block_hash;
    let proof;
    for(let i = 0; i < 3; i++) {
        try {
            proof = await near.connection.provider.sendJsonRpc(
                'light_client_proof',
                {
                type: 'receipt',
                receipt_id,
                // TODO: Use proper sender.
                receiver_id: nearSenderAccountId,
                light_client_head: clientBlockHashB58,
                }
            )
        }catch(e){
            const msg = e.message;
            const block = msg.slice(msg.indexOf("block ")+6);
            clientBlockHashB58 = block.slice(0, block.indexOf(" "))
        }
    }
    return borshifyOutcomeProof(proof);
    /*
    const hex2str = (hex) => {
        const h = "0123456789abcdef";
        return h[hex>>4]+h[hex&0xf];
    }
    return borshifyOutcomeProof(proof).reduce((a,b)=>a+hex2str(b), '0x');
    */
}

window.callSync = contractCall;
window.getProof = getReceiptProof;