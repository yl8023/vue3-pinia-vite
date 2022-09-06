<template>
    <van-tabs v-model:active="active" animated>
        <!-- 不显示van-tab组件的标题 -->
        <van-tab title="笔记本" name="note">
            <NoteList v-model:loading="listState['note'].loading" :finished="listState['note'].finished"
                :noteList="listState['note'].list" :noteDelState="delState['note']" :eyes="eyesActive"
                @noteLoad="onLoad" @openKeyboard="openNoteKeyboard"></NoteList>
        </van-tab>
        <!-- 不显示van-tab组件的标题 -->
        <van-tab title="待办" name="todo">
            <TodoList v-model:loading="listState['todo'].loading" :finished="listState['todo'].finished"
                :todoList="listState['todo'].list" :todoDelState="delState['todo']" @todoLoad="onLoad"></TodoList>
        </van-tab>
    </van-tabs>
    <van-overlay :show="keyboard.overlay" @click="closeKeyboard" z-index="99">
        <div class="password-box" @click.stop>
            <p class="title">{{ keyboard.title }}</p>
            <van-password-input :value="keyboard.value" :focused="keyboard.show" @focus="keyboard.show = true"
                info="请输入数字密码" />
            <transition name="van-fade">
                <div class="submit" v-if="keyboard.value!.length == 6">
                    <van-button size="small" block round type="primary" @click="openNote">确定</van-button>
                </div>
            </transition>
        </div>
        <van-number-keyboard v-model="keyboard.value" maxlength="6" :show="keyboard.show" @blur="keyboard.show = false"
            random-key-order />
    </van-overlay>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref } from "vue";
import { NoteItem, Keyboard, TodoItem, MemoType, MemoTypeId } from '@/common/constants';
import { homeStore } from '../../home.store';
import { onBeforeRouteUpdate, RouteLocationNormalizedLoaded, useRoute } from "vue-router";
import { calendar, momentFormat } from "@/common/util";
import NoteList from './note-list.vue';
import TodoList from './todo-list.vue';
import router from "@/app/router";
export default defineComponent({
    name: 'note-list',
    components: {
        NoteList,
        TodoList
    },
    setup() {
        const active: Ref<MemoType> = ref(MemoType.note) //路由tab页
        const eyesActive: Ref<Array<boolean>> = ref([]) //note列表眼睛图标
        const keyboard: Keyboard = reactive({overlay: false, value: ''})
        const listState: {
            [MemoType.note]: { list: Array<NoteItem>, loading: boolean, finished: boolean },
            [MemoType.todo]: { list: Array<TodoItem>, loading: boolean, finished: boolean }
        } = reactive({
            [MemoType.note]: {
                list: [] as Array<NoteItem>,
                loading: true,
                finished: false
            },
            [MemoType.todo]: {
                list: [] as Array<TodoItem>,
                loading: true,
                finished: false
            },
        }) //list列表数据
        const delState: any = ref(homeStore.delState)  //批量删除
        const route: RouteLocationNormalizedLoaded = useRoute()
        homeStore.$subscribe((mutation, state) => {
            listState[active.value].list = state.maps[active.value]
        })
        onMounted(() => {

            active.value = route.params.type as MemoType
            initEyesActive()
            onBeforeRouteUpdate((route) => {
                //监听---路由变化时，改变tab页
                active.value = route.params.type as MemoType
                listState[active.value].loading = true
                listState[active.value].finished = false
                getList()
            })
        })

        /**
         * 初始化小眼睛rive状态
         */
        const initEyesActive = () => {
            listState['note'].list.map((item, index) => {
                eyesActive.value[index] = false
            })
        }
        /**
        * 关闭密码弹窗
        */
        const closeKeyboard = () => {
            eyesActive.value[keyboard.index!] = false
            keyboard.overlay = false
        }

        const openNoteKeyboard = (keyNote: any) => {
            resetKeyboard()
            eyesActive.value[keyNote.index!] = true
            keyboard.note = keyNote.note
            keyboard.overlay = true
            keyboard.title = keyNote.note.name
            keyboard.index = keyNote.index!
            console.log(keyNote, keyboard)
        }
        /**
         * 初始化数字键盘
         */
        const resetKeyboard = () => {
            keyboard.overlay = false
            keyboard.value = ''
        }
        const openNote = () =>{
            if(keyboard.value === keyboard.note?.password) {
                router.push({
                    name: 'note',
                    query: {
                        id: keyboard.note![MemoTypeId.note] as MemoTypeId
                    }
                })
            } else {
                return console.log('密码错误')
            }
        }
        const onLoad = () => {
            getList()
        }
        const getList = () => {
            homeStore.setMap(active.value)
            setTimeout(() => {
                listState[active.value].list = homeStore.Maps[active.value]
                listState[active.value].loading = false
                listState[active.value].finished = true
            }, 800)
        }
        return {
            active,
            listState,
            delState,
            keyboard,
            openNoteKeyboard,
            onLoad,
            openNote,
            // selectItem,
            eyesActive,
            // switchChange,
            closeKeyboard,
            calendarFn: (date: any) => {
                return calendar(new Date(date))
            },
            format: (date: any) => {
                if (date) {
                    return momentFormat(date)
                } else {
                    return ''
                }

            }
        }
    }
})
</script>

<style lang="less">
.van-tabs__wrap {
    display: none;
}

.password-box {
    height: 150px;
    width: 300px;
    padding: 16px 12px;
    margin: 30% auto 0;
    background-color: #fff;
    border-radius: 6px;

    .title {
        margin: 0 auto 12px;
        height: 18px;

        text-align: center;
    }

    .submit {
        padding-top: 10px;
    }
}
</style>