<template>
    <div class="slider-bar">
        <van-popup v-model:show="PopupState" position="left" :style="{ width: '140px', height: '100vh' }">
            <van-cell-group title="选项" :border="false">
                <van-cell title="我的信息" icon="user-o" :border="false"/>
                <van-cell title="日历统计" icon="calendar-o" :border="false"/>
                <van-cell title="设置" icon="setting-o" :border="false"/>
            </van-cell-group>
        </van-popup>
        <div :class="{ 'popup-content': true, 'active': PopupState }">
            <van-nav-bar title="首页" v-if="!delState[activeName]">
                <template #left>
                    <div @click="showPopup">
                        <van-icon name="wap-nav" size="18" />
                    </div>
                </template>
                <template #right>
                    <van-popover v-model:show="showPopover" :show-arrow="false" :actions="actions"
                        placement="bottom-end" @select="popoverSelect">
                        <template #reference>
                            <van-icon name="ellipsis" size="18" />
                        </template>
                    </van-popover>
                </template>
            </van-nav-bar>

            <van-nav-bar title="批量删除" v-if="delState[activeName]">
                <template #left>
                    <div @click="cancelDel">
                        <span>取消</span>
                    </div>
                </template>
                <template #right>
                    <div @click="delComplete">
                        <span>确定</span>
                    </div>
                </template>
            </van-nav-bar>
            <slot>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import router from "@/app/router";
import { MemoType } from "@/common/constants";
import { computed, defineComponent, onMounted, PropType, Ref, ref } from "vue";
import { homeStore } from '../home.store';

export default defineComponent({
    name: 'slider-bar',
    props: {
        activeName: {
            type: String as PropType<MemoType>,
            default: MemoType.note
        }
    },
    setup(props) {
        const PopupState: Ref<boolean> = ref(false)
        const showPopover: Ref<boolean> = ref(false)
        const delState = ref(homeStore.delState)
        const actions: Ref<Array<any>> = ref([])
        const showPopup = () => {
            PopupState.value = true
        }
        const someDeleteState = computed(() => { //是否禁用批量删除
            if (props.activeName === MemoType.note) {
                if (homeStore.Maps[props.activeName].length === 0) {
                    return true
                }
            } else {
                const todoList = homeStore.Maps[props.activeName].filter((item) => {
                    return !item.complete
                })
                if (todoList.length === 0) {
                    return true
                }
            }
            return false
        })
        onMounted(() => {
            actions.value = [
                { text: '批量删除', icon: 'notes-o', disabled: someDeleteState, id: 'delete' },
                { text: '设置', icon: 'setting-o', id: 'setting' },
            ];


        })
        const popoverSelect = (action: { [key: string]: string }, index: number) => {
            switch (action.id) {
                case 'delete':
                    homeStore.openDel(props.activeName)
                    break;
                case 'setting':
                    router.push({
                        name: 'setting'
                    })
                    break;
            }
        }
        const cancelDel = () => {
            homeStore.closeDel(props.activeName)
        }
        const delComplete = () => {
            const list = [...homeStore.Maps[props.activeName]].filter((item) => {
                return item.delChecked
            }).map((item: any) => {
                item.isShow = false
                return item.id
            })

            homeStore.deleteItem(props.activeName, list)
            cancelDel()
        }
        return {
            PopupState,
            showPopup,
            actions,
            showPopover,
            popoverSelect,
            delState,
            cancelDel,
            delComplete
        }
    }
})
</script>
<style lang="less" scoped>
.van-nav-bar .van-icon {
    color: #000;
}

.van-icon-search {
    font-weight: bold;
}

.popup-content {
    width: 100%;
    height: 100vh;
    position: relative;
    left: 0;
    transition: left 0.3s ease-in-out;
    overflow: hidden;
}

.popup-content.active {
    left: 140px;
}
</style>