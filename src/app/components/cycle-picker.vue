<template>
    <van-popup :show="active" @update:show="updateActive" position="bottom">
        <van-picker :columns="columns" @confirm="onConfirm" @cancel="onCancel" />
    </van-popup>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
    name: 'cycle-picker',
    props: {
        active: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    emits: [
        'update:active',
        'sendCycle'
    ],
    setup(props, {emit}) {
        const columns = ['日', '周', '月', '年'];
        const updateActive = (e: boolean) => {
            emit('update:active', e)
        }
        const onConfirm = (value: any) => {
            emit('sendCycle', value)
            onCancel()
        }
        const onCancel = () => {
            emit('update:active', false)
        }
        return {
            columns,
            onCancel,
            updateActive,
            onConfirm
        }
    }
})
</script>