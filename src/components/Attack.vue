<template>
    <el-form ref="form" label-width="80px" label-position="top">
        <el-form-item label="Amount">
            <el-input v-model="amount"></el-input>
        </el-form-item>
        <el-form-item label="Beneficiary">
            <el-input v-model="Beneficiary"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="danger" style="width: 100%" @click="click" :loading="busy" :disabled="disabled"> Attack! </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "attack",
    data() {
        return {
            amount: "1",
            Beneficiary: this.address,
        };
    },
    props: ["address", "busy", "disabled"],
    methods:{
        click(){
            this.$emit("attack", {amount:this.amount, to:this.Beneficiary});
        }
    },
    watch:{
        address(){
            if(!this.Beneficiary.length) this.Beneficiary = this.address;
        }
    }
};
</script>