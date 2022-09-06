<template>
    <transition name="van-fade">
        <div class="loading-box" v-show="visible">
            <canvas width="80" height="80" ref="stateLoadingPerson"></canvas>
        </div>
    </transition>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, Ref, ref } from "vue";
import {Rive, Layout, Fit, Alignment} from "@rive-app/canvas"; //rive 插件使用

export default defineComponent({
    name: 'person-walk',
    props: {
        visible: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup() {
        const stateLoadingPerson: Ref<any> = ref()
        // const interval = ref()
        onMounted(() => {
            startRive()
        })
        const startRive = () => {
            const riveInstance = new Rive({
                src: new URL('../../assets/rive/skins_person.riv', import.meta.url).href,  //vite 在ts 中引入静态资源的一种方法
                layout: new Layout({
                    fit: Fit.ScaleDown,
                    alignment: Alignment.Center
                }),
                canvas: stateLoadingPerson.value,
                autoplay: true,
                stateMachines: "Motion",
                onLoad: (_: any) => {
                    // const stateMachineInputs = riveInstance.stateMachineInputs("Motion");
                    // interval.value = setInterval(() => {
                    //     stateMachineInputs[0].fire()
                    // }, 500);
                }
            })
        }
        
        // onUnmounted(() => {
        //     interval.value = null
        // })
        return {
            stateLoadingPerson
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