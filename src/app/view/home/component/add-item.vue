<template>
    <div>
        <van-popup :show="active" @update:show="updateShow" position="bottom" round :overlay="false"
            :style="{ right: 0, margin: 'auto', width: '90%', zIndex: '-1', paddingBottom: '80px', boxShadow: '0 0 6px 3px #d3d3d3' }"
            @closed="bottomClosed">
            <!-- 新建笔记本 -->
            <van-cell-group v-if="noteTodoAnime">
                <template #title>
                    <van-field class="title-field" v-model="newNote.password" maxlength="6" type="digit"
                        :error="newNote.password!.length == 0 && errorStatus"
                        :placeholder="newNote.verify ? '6位数字密码' : ''" :disabled="!newNote.verify">
                        <template #label>
                            <div class="title-flex">
                                <span>笔记本</span>
                            </div>
                        </template>
                        <template #right-icon>
                            <div class="title-flex">
                                <eye-status :width="15" :height="15" v-model:active="eyeActive" @click="changeState">
                                </eye-status>
                            </div>
                        </template>
                    </van-field>
                </template>
                <van-field v-model="newNote.name" :error="newNote.name.length == 0 && errorStatus" left-icon="fire-o"
                    label="标题" placeholder="请输入笔记标题" />
                <van-field v-model="newNote.label" left-icon="label-o" type="textarea"
                    placeholder="写下记录笔记时的情景、心情或者摘要都可以噢！" maxlength="40" rows="2" label="简介" show-word-limit />
            </van-cell-group>
            <!-- 新建待办 -->
            <van-cell-group v-if="todoNoteAnime">
                <van-field v-model="todoItem.name" :error="todoItem.name.length == 0 && errorStatus"
                    left-icon="todo-list-o" label="标题" placeholder="待办事项" />
                <van-radio-group direction="horizontal" v-model="todoChecked">
                    <van-cell title="指定时间">
                        <template #right-icon>
                            <van-radio name="time" />
                        </template>
                    </van-cell>
                    <van-cell title="周期目标">
                        <template #right-icon>
                            <van-radio name="cycle" />
                        </template>
                    </van-cell>
                </van-radio-group>
                <van-cell v-if="todoChecked === 'time'">
                    <template #title>
                        <div class="date-box">
                            <span @click="openDateBox('date')">{{ dateBox.date }}</span>
                            <span @click="openDateBox('time')">{{ dateBox.time }}</span>
                        </div>
                    </template>
                </van-cell>
                <van-field v-if="todoChecked === 'cycle'" v-model="todoCycle.call" is-link readonly name="picker"
                    label="周期" placeholder="点击选择" @click="cyclePicker = true" />
            </van-cell-group>
            <div class="popup-button">
                <van-button round size="small" block type="primary" @click="complete">完成</van-button>
            </div>
        </van-popup>
        <cycle-picker v-model:active="cyclePicker" @sendCycle="getCycle"></cycle-picker>
        <date-select v-model:dateBoxState="dateBox.state" :dateType="dateBox.type" @sendDate="getDate"></date-select>
    </div>
</template>
<script lang="ts">
import { MemoType, NoteItem, TodoItem, TodoType } from '@/common/constants';
import { momentFormat } from '@/common/util';
import { computed } from '@vue/reactivity';
import { defineComponent, onMounted, PropType, ref, reactive, Ref, watchEffect } from 'vue';
import { onBeforeRouteUpdate, RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { homeStore } from '../home.store';

export default defineComponent({
    name: 'add-item',
    props: {
        addType: { //底部add弹框类型
            type: String as PropType<MemoType>,
            default: MemoType.note
        },
        active: { //底部add弹框状态
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    emits: [
        'update:active'
    ],
    setup(props, { emit }) {
        const route: RouteLocationNormalizedLoaded = useRoute()
        const errorStatus: Ref<boolean> = ref(false) //底部add弹窗表单验证状态
        const eyeActive: Ref<boolean> = ref(false) //笔记本是否启用密码
        const newNote: Ref<NoteItem> = ref({} as NoteItem) //笔记本对象
        const todoItem: Ref<TodoItem> = ref({} as TodoItem) //待办对象
        const dateBox: Ref<{ [key: string]: any }> = ref({}) //待办时间对象
        const cyclePicker: Ref<boolean> = ref(false) //待办周期选择器
        const beforeActiveRoute = ref('') //底部弹框是打开的时候才会记录当前路由path
        const todoChecked: Ref<TodoType> = ref(TodoType.time) //待办单选时间或地址
        const todoCycle = reactive({
            call: '日'
        })
        onMounted(() => {
            watchEffect(() => {
                newNote.value.verify = eyeActive.value  //打开笔记本开启密码的开关
            })
            watchEffect(() => {
                if (!props.active) {
                    eyeActive.value = false
                    todoChecked.value = TodoType.time
                }
                if (props.addType === MemoType.note) {
                    //打开add弹窗，初始化对象 --> 笔记本数据
                    newNote.value = {
                        name: '',
                        label: '',
                        password: '',
                        verify: false,
                        createTime: new Date().getTime()
                    }
                } else {
                    //打开add弹窗，初始化对象 --> 待办数据
                    todoItem.value = {
                        name: '',
                        type: 0,
                        createTime: new Date().getTime()
                    }
                    dateBox.value = {
                        state: false,
                        type: 'date',
                        date: momentFormat(new Date(), 'YYYY-MM-DD'),
                        time: momentFormat(new Date(), 'HH:mm')
                    }
                    todoCycle.call = '日'
                }
                errorStatus.value = false
            })
        })
        /**
         * 关闭底部弹框动画执行完之后触发
         */
        const bottomClosed = () => {
            if (beforeActiveRoute.value !== '') {
                if (beforeActiveRoute.value !== route.path) {
                    emit('update:active', true)
                }
                beforeActiveRoute.value = ''
            }
        }
        const noteTodoAnime = computed(() => {
            return props.addType === MemoType.note && beforeActiveRoute.value === ''
        })
        const todoNoteAnime = computed(() => {
            return props.addType === MemoType.todo && beforeActiveRoute.value === ''
        })

        /**
         * 路由监听---如果底部弹框是打开状态，则关闭，并记录变化之前的路由path
         */
        onBeforeRouteUpdate(() => {
            //如果打开了添加item的弹窗，则在切换路由时会变化成对应item的弹窗
            if (props.active) {
                beforeActiveRoute.value = route.path
                emit('update:active', false)
            }
            //如果打开了批量删除，则在切换路由时会关闭此状态
            const type = route.params.type as MemoType
            if (homeStore.DelState[type]) {
                homeStore.closeDel(type)
            }
        })

        /**
         * 添加新item 完成
         */
        const complete = () => {
            switch (props.addType) {
                case MemoType.note:
                    if (newNote.value.verify) {
                        if (newNote.value.password!.length === 0 || newNote.value.name.length === 0) {
                            return errorStatus.value = true
                        }
                    } else {
                        if (newNote.value.name.length === 0) {
                            return errorStatus.value = true
                        }
                    }
                    homeStore.addItem(MemoType.note, newNote.value)
                    break;
                case MemoType.todo:
                    if (todoItem.value.name.length === 0) {
                        return errorStatus.value = true
                    }
                    if (todoChecked.value === TodoType.time) { //待办
                        todoItem.value.datetime = new Date(dateBox.value.date + ' ' + dateBox.value.time).getTime()
                        todoItem.value.complete = false
                    }
                    if (todoChecked.value === TodoType.cycle) { //计划
                        todoItem.value.type = 1
                        todoItem.value.call = todoCycle.call
                    }
                    homeStore.addItem(MemoType.todo, todoItem.value)

                    break;
            }
            errorStatus.value = false
            emit('update:active', false)
        }
        /**
         * change眼睛状态
         */
        const changeState = () => {
            eyeActive.value = !eyeActive.value
        }
        /**
         * 打开待办中选择时间弹窗
         * @param type date | time
         */
        const openDateBox = (type: string) => {

            dateBox.value.type = type
            dateBox.value.state = true
        }
        /**
         * 设置待办指定的时间
         * @param e 
         */
        const getDate = (e: { type: string, value: any }) => {
            dateBox.value[e.type] = e.value
        }
        const getCycle = (call: any) => {
            todoCycle.call = call
        }
        const updateShow = (e: boolean) => {
            emit('update:active', e)
        }
        return {
            noteTodoAnime,
            todoNoteAnime,
            newNote,
            todoItem,
            errorStatus,
            eyeActive,
            todoChecked,
            dateBox,
            cyclePicker,
            todoCycle,
            updateShow,
            changeState,
            getCycle,
            getDate,
            openDateBox,
            bottomClosed,
            complete
        }
    }
})
</script>

<style lang="less" scoped>
.title-field {
    padding: 0;

    .title-flex {
        display: flex;
        align-items: center;
        justify-content: left;
    }
}

.date-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.address-box {
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-button {
    margin: 12px 40px 0;
}
</style>