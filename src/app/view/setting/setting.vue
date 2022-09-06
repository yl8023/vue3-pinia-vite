<template>
    <van-nav-bar title="设置">
            <template #left>
                <van-icon name="arrow-left" @click="routerCancel"/>
            </template>
        </van-nav-bar>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { routerCancel } from "@/common/util";

export default defineComponent({
    name: 'setting',
    setup(){
        return{
            routerCancel
        }
    }
})
</script>