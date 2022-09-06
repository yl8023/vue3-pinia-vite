<template>
    <van-popup :show="dateBoxState" @update:show="updateBoxState" position="bottom">
        <van-datetime-picker
            v-if="dateType == 'date'"
            v-model="currentDate"
            type="date"
            title="选择时间"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="cancelPop"
            @confirm="confirmDate($event, 'date')"
            />
        <van-datetime-picker
            v-if="dateType == 'time'"
            v-model="currentTime"
            type="time"
            title="选择时间"
            @cancel="cancelPop"
            @confirm="confirmDate($event, 'time')"
            />
    </van-popup>
</template>
<script lang="ts">
import { momentFormat } from "@/common/util";
import { defineComponent, PropType, ref } from "vue";

export default defineComponent({
    name: 'date-select',
    props: {
        dateBoxState: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        dateType: {
            type: String as PropType<string>,
            default: 'date'
        }
    },
    emits: [
        'update:dateBoxState',
        'sendDate'
    ],
    setup(props, {emit}) {
        const currentDate = ref(new Date())
        const currentTime = ref(new Date().getHours() + '')
        const updateBoxState = (e : boolean) => {
            emit('update:dateBoxState', e)
        }
        const cancelPop = () => {
            emit('update:dateBoxState', false)
        }
        const confirmDate = (e: any, type: any) => {
            const value = type === "date" ? momentFormat(e, 'YYYY-MM-DD') : e
            emit('sendDate', {type , value})
            cancelPop()
        }
        return {
            updateBoxState,
            currentDate,
            currentTime,
            minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            maxDate: new Date(new Date().getFullYear() + 99, 1, 1),
            cancelPop,
            confirmDate,
        }
    }
})
</script>
<style lang="less" scoped>
</style>