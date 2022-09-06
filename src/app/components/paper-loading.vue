<template>
    <transition name="van-fade">
        <div class="loading-box" v-show="visible">
            <canvas width="80" height="80" ref="statePaperLoading"></canvas>
        </div>
    </transition>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref } from "vue";
import {Rive, Layout, Fit, Alignment} from "@rive-app/canvas"; //rive 插件使用

export default defineComponent({
    name: 'paper-loading',
    props: {
        visible: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup() {
        const statePaperLoading: Ref<any> = ref()
        let riveInstance: any;
        onMounted(() => {
            startRive()
        })
        const startRive = () => {
            riveInstance = new Rive({
                src: new URL('../../assets/rive/paper-loading.riv', import.meta.url).href,  //vite 在ts 中引入静态资源的一种方法
                layout: new Layout({
                    fit: Fit.ScaleDown,
                    alignment: Alignment.Center
                }),
                canvas: statePaperLoading.value,
                // autoplay: true,
                stateMachines: "State Machine 1",
                onLoad:(_: any) => {
                    const stateMachineInputs = riveInstance.stateMachineInputs('State Machine 1')
                    
                    stateMachineInputs[0].fire()
                    stateMachineInputs[1].value = 50
                    console.log(stateMachineInputs)
                    
                },
            })
        }
        return {
            statePaperLoading
        }
    }
})
</script>
<style lang="less" scoped>
.loading-box{
    top: 0;
    left: 0;
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>