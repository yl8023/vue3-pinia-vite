<template>
        <div class="first-screen">
            <canvas ref="firstScreen"></canvas>
            <div class="start-box" @click="startFn">
                <van-button round type="warning" size="small">开始使用</van-button>
            </div>
        </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, Ref, } from 'vue'
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";
import router from '@/app/router';
export default defineComponent({
    name: 'screen',
    setup() {
        const firstScreen: Ref<any> = ref()
        onMounted(() => {
            const riveInstance = new Rive({
                src: new URL('../../../assets/rive/first-screen.riv', import.meta.url).href,  //vite 在ts 中引入静态资源的一种方法
                layout: new Layout({
                    fit: Fit.ScaleDown,
                    alignment: Alignment.Center
                }),
                canvas: firstScreen.value,
                autoplay: true,
                onLoad: (_: any) => {
                    riveInstance.resizeDrawingSurfaceToCanvas()
                }
            })
        })
        const startFn = () => {
            router.push({
                name: 'home/list',
                params: {
                    type: 'note'
                }
            })
        }
        return {
            firstScreen,
            startFn
        }
    }
})
</script>

<style lang="less" scoped>
.first-screen {
    width: 100vw;
    height: 100vh;
    background-color: antiquewhite;
    position: relative;

    .start-box {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 20%;
    }

    canvas {
        width: 100%;
        height: 100%;
    }
}
</style>
