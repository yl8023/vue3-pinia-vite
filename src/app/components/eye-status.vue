<template>
    <canvas :width="width" :height="height" ref="eyeState"></canvas>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, ref, Ref, watchEffect } from "vue";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";

export default defineComponent({
    name: 'eye-status',
    props: {
        active: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        width: {
            type: Number as PropType<number>,
            default: false
        },
        height: {
            type: Number as PropType<number>,
            default: false
        },
    },
    emits: ['update:active'],
    setup(props, {emit}) {
        const eyeState: Ref<any> = ref()
        let riveInstance: Rive
        onMounted(() => {
            riveInstance = new Rive({
                src: new URL('../../assets/rive/eye-icon.riv', import.meta.url).href,  //vite 在ts 中引入静态资源的一种方法
                layout: new Layout({
                    fit: Fit.Cover,
                    alignment: Alignment.Center
                }),
                canvas: eyeState.value,
                autoplay: true,
                stateMachines: "State Machine 1",
                onLoad: (_: any) => {
                    riveInstance.resizeDrawingSurfaceToCanvas();
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
        return {
            eyeState
        }
    }
})
</script>

<style lang="less" scoped>
</style>