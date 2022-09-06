<template>
    <transition name="van-fade">
        <div class="loading-box" v-show="visible" @click="stateMachineFn">
            <canvas width="80" height="80" ref="stateLoadingPerson"></canvas>
        </div>
    </transition>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, Ref, ref } from "vue";
import {Rive, Layout, Fit, Alignment} from "@rive-app/canvas"; //rive 插件使用

export default defineComponent({
    name: 'delivery',
    props: {
        visible: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup() {
        const stateLoadingPerson: Ref<any> = ref()
        let riveInstance: any;
        onMounted(() => {
            startRive()
        })
        const startRive = () => {
            riveInstance = new Rive({
                src: new URL('../../assets/rive/delivery.riv', import.meta.url).href,  //vite 在ts 中引入静态资源的一种方法
                layout: new Layout({
                    fit: Fit.ScaleDown,
                    alignment: Alignment.Center
                }),
                canvas: stateLoadingPerson.value,
                autoplay: true,
                stateMachines: "State Machine 1",
            })
        }
        const stateMachineFn = () => {
            const stateMachineInputs = riveInstance.stateMachineInputs("State Machine 1");
            stateMachineInputs[0].fire()
        }
        return {
            stateLoadingPerson,
            stateMachineFn,
        }
    }
})
</script>
<style lang="less" scoped>
.loading-box{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}
</style>