<template>
    <canvas class="add-status" width="35" height="35" ref="addStatus" @click="onclickFn"></canvas>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, ref, Ref, watchEffect } from "vue";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";

export default defineComponent({
    name: 'add-status',
    props:{
        active: {
            type: Boolean as PropType<boolean>,
            default: false
        } 
    },
    emits: ['update:active'],
    setup(props, {emit}) {
        const addStatus: Ref<any> = ref()
        let riveInstance: Rive
        onMounted(() => {
            riveInstance = new Rive({
                src: new URL('../../../../assets/rive/add-status-1.riv', import.meta.url).href,  //vite 在ts 中引入静态资源的一种方法
                layout: new Layout({
                    fit: Fit.ScaleDown,
                    alignment: Alignment.Center
                }),
                canvas: addStatus.value,
                autoplay: true,
                stateMachines: 'State Machine 1',
                onLoad: (_: any) => {
                    riveInstance.resizeDrawingSurfaceToCanvas()
                    const MachineInputs = riveInstance.stateMachineInputs("State Machine 1");
                    watchEffect(()=> {
                        MachineInputs[0].value = props.active
                    })
                    
                },
                onStateChange: () => {
                    const MachineInputs = riveInstance.stateMachineInputs("State Machine 1");
                    emit('update:active', MachineInputs[0].value)
                }
            })
        })
        const changeState = () => {
            const MachineInputs = riveInstance.stateMachineInputs("State Machine 1");
            MachineInputs[0].value = !MachineInputs[0].value
            
        }
        const onclickFn = () => {
            changeState()
        }
        return {
            addStatus,
            onclickFn
        }
    }
})
</script>

<style lang="less" scoped>
.add-status{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
</style>