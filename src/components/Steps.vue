<template>
    <div style="height: 300px">
        <el-steps direction="vertical" :active="istep" finish-status="success" :process-status="status">
            <el-step v-for="(step,index) in steps" 
            :key="index" 
            :title="step" 
            :icon="istep == index ? 'el-icon-loading' : ''"/>
        </el-steps>
    </div>
</template>
<script>

const nearSteps = ["near: send attack transaction", "near: get attack proof data", "eth: verify and exec attack proof data", "eth: get rewards", "success!"]
const ethSteps = ["eth: send attack transaction", "eth: get attack proof data", "near: verify and exec attack proof data", "near: get rewards", "success!"]
export default {
    name:"Steps",
    data(){return {
    }},
    props:["direction", "istep", "status"],
    computed:{
        steps(){
            if(this.direction == "eth2near")
                return ethSteps;
            if(this.direction == "near2eth")
                return nearSteps;
            return [];
        }
    }
}
</script>