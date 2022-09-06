<template>
    <van-list class="content-body" :loading="loading" @update:loading="updateLoading" :finished="finished"
        @load="onLoad">
        <van-cell-group inset :border="false" title="进行中" v-if="conductList.length > 0">
            <transition name="van-slide-right" v-for="(item, index) of conductList" :key="index">
                <van-cell v-if="item.isShow" clickable center class="van-todo-box "
                    @click="selectTodoItem(item.todoId!)"
                    :title-class="{ 'van-l-post': todoDelState, 'todo-title': true }"
                    :value-class="{ 'van-l-post': todoDelState, 'todo-value': true }">
                    <template #label>
                        <div v-if="item.datetime" class="van-ellipsis">
                            {{ calendarFn(item.datetime) }}
                        </div>
                    </template>
                    <template #title>
                        <div class="van-ellipsis">
                            {{ item.name }}
                        </div>
                    </template>
                    <template #default>
                        <div class="todo-value">
                            <span class="time">{{ calendarFn(item.createTime) }}</span>
                        </div>
                    </template>
                    <template #icon>
                        <transition name="van-slide-left">
                            <van-checkbox @click.stop="onCheckbox(item)" class="check-left-box" v-if="!todoDelState"
                                v-model="item.complete">
                            </van-checkbox>
                        </transition>
                    </template>
                    <template #right-icon>
                        <transition name="van-slide-right">
                            <van-checkbox @click.stop class="check-right-box" v-if="todoDelState"
                                v-model="item.delChecked" shape="square"></van-checkbox>
                        </transition>
                    </template>
                </van-cell>
            </transition>
        </van-cell-group>
        <van-cell-group inset :border="false" title="计划中" v-if="cycleList.length > 0">
            <van-cell class="van-todo-box todo" v-for="(item, index) of cycleList" :key="index"
                @click="selectTodoItem(item.todoId!)" :title-class="{ 'todo-title': true }"
                :value-class="{ 'van-l-post': todoDelState, 'todo-value': true }">
                <template #title>
                    <div class="van-ellipsis">
                        <span>{{ item.name }}</span>
                    </div>
                </template>
                <template #label>
                    <div>
                        每<span>{{ item.call }}</span>计划 | 累计打卡
                        <van-tag color="#ff9b15" plain type="primary">{{ item.count || 0 }}次</van-tag>
                    </div>
                </template>
                <template #default>
                    <div class="todo-value">
                        <span class="time">{{ calendarFn(item.createTime) }}</span>
                    </div>
                    <van-switch v-model="item!.state" @click.stop size="18" @change="switchSign($event, item!)"
                        :disabled="item!.state">
                        <template #node>
                            <div class="icon-wrapper">
                                <van-icon color="#1989fa" :name="item!.state ? 'success' : ''" size="18" />
                            </div>
                        </template>
                    </van-switch>
                </template>
                <template #icon>
                    <transition name="van-slide-left">
                        <div class="sign-box" v-if="item!.state">
                            已打卡
                        </div>
                    </transition>
                </template>
                <template #right-icon>
                    <transition name="van-slide-right">
                        <van-checkbox @click.stop class="check-right-box" v-if="todoDelState" v-model="item.delChecked"
                            shape="square"></van-checkbox>
                    </transition>
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group inset :border="false" title="已完成" v-if="completeList.length > 0">
            <van-cell center class="van-todo-box todo" v-for="(item, index) of completeList" :key="index"
                :title-class="{ 'todo-title': true }">
                <template #title>
                    <div class="van-ellipsis del-divider-box">
                        <span>{{ item.name }}</span>
                        <van-divider class="del-divider" />
                    </div>
                </template>
                <template #label>
                    <div v-if="item.datetime" class="van-ellipsis">
                        {{ calendarFn(item.datetime) }}
                    </div>
                </template>

                <template #default>
                    <div class="todo-value">
                        <span class="time">{{ calendarFn(item.createTime) }}</span>
                    </div>
                </template>
                <template #icon>
                    <van-checkbox @click.stop="onCheckbox(item)" class="check-left-box" v-model="item.complete">
                    </van-checkbox>
                </template>
            </van-cell>
        </van-cell-group>
        <template #finished>
            <van-empty v-if="todoList.length === 0" description="还没有待办事项...">
                <template #image>
                    <delivery :visible="true"></delivery>
                </template>
            </van-empty>
        </template>
    </van-list>
</template>

<script lang="ts">
import router from '@/app/router';
import { MemoType, MemoTypeId, TodoItem } from '@/common/constants';
import { calendar, momentFormat } from '@/common/util';
import { computed } from '@vue/reactivity';
import { defineComponent, PropType, toRaw } from 'vue';
import { moment } from '@/main';
import { homeStore } from '../../home.store';

export default defineComponent({
    name: 'todo-list',
    props: {
        loading: {
            type: Boolean as PropType<boolean>,
            default: true
        },
        finished: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        todoList: {
            type: Array as PropType<Array<TodoItem>>,
            default: () => []
        },
        todoDelState: {
            type: Boolean as PropType<boolean>,
            default: false
        },
    },
    emits: [
        'update:loading',
        'todoLoad'
    ],
    setup(props, { emit }) {
        const selectTodoItem = async (id: string) => {
            const item: TodoItem = await homeStore.getItemById(MemoType.todo, id)
            if (props.todoDelState) {
                item.delChecked = !item.delChecked
            } else {
                router.push({
                    name: 'todo',
                    query: {
                        id: (item as TodoItem)[MemoTypeId.todo]
                    }
                })
            }
        }

        const onCheckbox = (item: TodoItem) => {
            homeStore.setItemById(MemoType.todo, toRaw(item))
        }
        /**
         * 计划中  每{{@param todoItem.call}}签到
         * @param state 
         * @param todoItem 
         */
        const switchSign = (state: boolean, todoItem: TodoItem) => {
            if (state) {
                const today = momentFormat(new Date(), 'YYYY-MM-DD')
                todoItem.stateDateList ? todoItem.stateDateList.push(today) : todoItem.stateDateList = [today]
                todoItem.count = todoItem.stateDateList.length
                homeStore.setItemById(MemoType.todo, toRaw(todoItem))
            }
        }
        /**
         * 重置打卡状态
         * @param todoItem 
         */
        const reloadSign = (todoItem: TodoItem) => {
            if (!todoItem.state) return;
            const todays = momentFormat(new Date(), 'YYYY-MM-DD').split('-')
            const stateDateList: any[] = todoItem.stateDateList || []
            const signDay = stateDateList[stateDateList.length - 1]
            switch (todoItem.call) {
                case '日':
                    const cycleDays = signDay.split('-')
                    if (cycleDays[0] === todays[0] && cycleDays[1] === todays[1] && todays[2] > cycleDays[2]) {
                        todoItem.state = false
                    }
                    break;

                case '周':
                    const weekDay = new Date(signDay).getDay() === 0 ? 7 : new Date(signDay).getDay()
                    const weekLastDay = moment(signDay).add(7 - weekDay, 'day').hour(23).minute(59).second(59).valueOf()
                    if (moment().valueOf() > weekLastDay) {
                        todoItem.state = false
                    }
                    break;

                case '月':
                    break;

                case '年':
                    break;
            }
        }
        const onLoad = () => {
            emit('todoLoad', 'todoLoad')
        }
        const updateLoading = (e: any) => {
            emit('update:loading', e)
        }
        return {
            onLoad,
            onCheckbox,
            updateLoading,
            selectTodoItem,
            conductList: computed(() => {  //进行中
                return props.todoList.filter((item) => {
                    return !item.complete && item.type! === 0
                })
            }),
            cycleList: computed(() => {  //计划中
                return props.todoList.filter((item) => {
                    return item.type! === 1
                }).map((item) => {
                    reloadSign(item)
                    return item
                })
            }),
            completeList: computed(() => {  //已完成
                return props.todoList.filter((item) => {
                    return item.complete
                })
            }),
            calendarFn: (date: any) => {
                return calendar(new Date(date))
            },
            switchSign,
        }
    }
})
</script>
<style lang="less" scoped>
.van-cell-group--inset {
    margin-top: 10px;
}

.content-body {
    height: calc(100vh - 46px - 70px);
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 20px;

    .van-todo-box {
        padding-left: 0;

        ::v-deep(.todo-title) {
            padding-left: 8px;
            position: relative;
            left: 28px;
            transition: left 0.3s;
            width: 50%;
        }

        .del-divider-box {
            color: #888;
            position: relative;

            .del-divider {
                position: absolute;
                width: 100%;
                top: -5px;
                left: 0;
                border-color: #888
            }
        }

        .check-left-box {
            padding-left: 8px;
            position: absolute;
            z-index: 0;
        }

        ::v-deep(.todo-value) {
            position: relative;
            left: 0px;
            transition: left 0.3s;

            .time {
                flex: 1;
                font-size: 10px;
            }

            .eyeStatus {
                margin-left: 16px;
            }

            .check-box {
                margin-left: 10px;
                position: absolute; //note  checkbox
                right: 16px;
            }

        }

        ::v-deep(.van-l-post.todo-title) {
            left: 0px;
        }

        ::v-deep(.van-l-post.todo-value) {
            left: -28px;
        }

        .sign-box {
            background-color: #ff9b15;
            color: #fff;
            display: flex;
            justify-content: center;
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            writing-mode: vertical-lr;
            padding-top: 8px;
            letter-spacing: 6px;
        }

        .check-right-box {
            margin-left: 10px;
            position: absolute; //todo  checkboc
            right: 16px;
            z-index: 0;
        }
    }
}
</style>