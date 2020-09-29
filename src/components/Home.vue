<template>
    <div>
        <el-row :gutter="12">
            <el-col :span="7">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>Ethereum</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="ethLogout"
                            >X</el-button
                        >
                    </div>
                    <div v-if="!ethAccount.length">
                        <el-button
                            type="primary"
                            style="width: 100%"
                            @click="ethLogin"
                            >login</el-button
                        >
                    </div>
                    <div v-else>
                        <Attack
                            :address="nearAccount"
                            @attack="ethAttack"
                            :busy="ethbusy"
                            :disabled="nearbusy"
                        />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card shadow="always" class="card-min">
                    <div slot="header" class="clearfix">
                        <span>DIRECTION: {{ direction }}</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="stepStart('NONE')"
                            >X</el-button
                        >
                    </div>
                    <div v-if="direction!='NONE'" >
                      <Steps :direction="direction" :istep="step" />
                    </div>
                    <div v-else>
                      <ul>
                        <li>ETH-Account: {{ ethAccount }}</li><br>
                        <li>ETH-Birdge: {{ $eBridge.bridgeAddress }}</li><br>
                        <li>ERC20: {{ $eBridge.tokenAddress }}</li><br>
                        <li>ERC20-Balance: {{ erc20 }}</li><br>
                        <li>NEAR-Account: {{ nearAccount }}</li><br>
                        <li>NEAR-Birdge: {{ $nBridge.bridgeAddress }}</li><br>
                        <li>NRC20-Balance: {{ nrc20 }}</li><br>
                        <li>github</li><br>
                      </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>NEAR</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="nearLogout"
                            >X</el-button
                        >
                    </div>
                    <div v-if="!nearAccount.length">
                        <el-button
                            type="primary"
                            style="width: 100%"
                            @click="nearLogin"
                            >login</el-button
                        >
                    </div>
                    <div v-else>
                        <Attack
                            :address="ethAccount"
                            :busy="nearbusy"
                            :disabled="ethbusy"
                            @attack="nearAttack"
                        />
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Attack from "./Attack.vue";
import Steps from "./Steps.vue";
export default {
    name: "Home",
    props: {
        msg: String,
    },
    components: { Attack, Steps },
    data() {
        window.xx = this;
        return {
            ethAccount: "",
            nearAccount: "",
            ethbusy: false,
            nearbusy: false,
            direction: "NONE",
            step: 0,
            erc20:"-",
            nrc20:"-",
        };
    },
    methods: {
        async updateBalance(isErc20){
          if(isErc20)
            this.erc20 = await this.$eBridge.getTokenBalance();
          else
            this.nrc20 = await this.$nBridge.getTokenBalance();
        },
        stepStart(direction) {
            if(direction == "NONE") {
              this.updateBalance(true);
              this.updateBalance(false);
            }
            this.direction = direction;
            this.step = 0;
        },
        nextStep() {
            this.step++;
        },
        async relay(from, to, tx) {
            console.log("relay:", tx);
            this.nextStep();
            const proof = await from.getProof(tx);
            this.nextStep();
            console.log("---------handleProof...");
            await to.handleProof(proof);
            this.nextStep();
            console.log("---------deal...");
            await to.deal();
            this.nextStep();
            this.nextStep();
        },
        async ethAttack(info) {
            this.stepStart("eth2near");
            this.ethbusy = true;
            console.log("ethAttack:", info);
            const eb = this.$eBridge;
            const nb = this.$nBridge;
            const tx = await eb.attack(info.amount, info.to);
            await this.relay(eb, nb, tx);
            this.ethbusy = false;
        },
        async nearAttack(info) {
            this.stepStart("near2eth");
            this.nearbusy = true;
            console.log("nearAttack:", info);
            const eb = this.$eBridge;
            const nb = this.$nBridge;
            const tx = await nb.attack(info.amount, info.to);
            await this.relay(nb, eb, tx);
            this.nearbusy = false;
        },
        async nearLogin() {
            console.log("nearLogin");
            this.nearAccount = await this.$nBridge.login();
            this.updateBalance(false);
        },
        nearLogout() {
            console.log("nearLogout");
            this.nearAccount = "";
            this.nrc20='';
            this.$nBridge.logout();
        },
        async ethLogin() {
            this.ethAccount = await this.$eBridge.login();
            console.log("ethLogin");
            this.updateBalance(true);
        },
        ethLogout() {
            this.ethAccount = "";
            this.$eBridge.logout();
            this.erc20='-'
            console.log("ethLogout");
        },
    },
    async mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}

.card-min {
    min-height: 400px;
}
</style>
