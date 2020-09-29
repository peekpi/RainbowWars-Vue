//import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";
import getConfig from "./nearConfig";
//import { callAsync, getProof } from './relay';

//window.callAsync = callAsync;
//window.getProof = getProof;

class NearSDK {
    constructor(config) {
        this.nearAPI = nearAPI;
        this.config = config;
        this.abi = {
            viewMethods: ['balanceOf'],
            changeMethods: ['deal', 'ExecProof'],
        }
        this.initOnce();
    }

    initOnce () {
        if(this.contract) return;
        return this.connect().then(()=>this.ContractInit());
    }
    // Connects to NEAR and provides `near`, `walletAccount` and `contract` objects in `window` scope
    async connect() {
        console.log("connect");
        // Initializing connection to the NEAR node.
        this.near = await this.nearAPI.connect(Object.assign(this.config, { deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }));
        // Needed to access wallet login
        this.walletAccount = new nearAPI.WalletConnection(this.near);
        console.log("end");
        
        // Initializing our contract APIs by contract name and configuration.
        //new nearApi.Contract(yourAccount, contractId, { viewMethods, changeMethods })
    }

    ContractInit(){
        console.log("init ContractInit");
        this.contract = new this.nearAPI.Contract(
            this.walletAccount.account(),
            this.config.contractName,
            this.abi
        );
        console.log("init end");
    }

    async login() {
        const account = this.walletAccount.getAccountId();
        if (!account) {
            await this.walletAccount.requestSignIn(this.config.contractName, 'NEAR Counter Example');
        }
        return this.walletAccount.getAccountId();
    }
    logout() {
        this.walletAccount.signOut();
    }
}
const nearConfig = getConfig("development");
export const nearSDK = new NearSDK(nearConfig);
window.nearSDK = nearSDK;