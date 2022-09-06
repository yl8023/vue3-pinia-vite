<template>
    <van-list class="content-body" :loading="loading" @update:loading="updateLoading" :finished="finished"
        @load="onLoad">
        <transition name="van-slide-right" v-for="(item, index) of noteList" :key="index">
            <van-cell-group v-if="item.isShow" inset :border="false" @click="selectNoteItem(item.noteId!, index)">
                <van-cell :label="item.label" clickable center class="van-note-box note">
                    <template #title>
                        <div class="van-ellipsis">
                            {{ item.name }}
                        </div>
                    </template>
                    <template #default>
                        <div class="van-note-value">
                            <span class="time">{{ calendarFn(item.createTime) }}</span>
                            <eye-status class="eyeStatus" v-if="item.verify" :width="15" :height="15"
                                v-model:active="eyes[index]">
                            </eye-status>

                        </div>
                    </template>
                    <template #right-icon>
                        <transition name="van-slide-right">
                            <van-checkbox @click.stop class="note-right-box" v-if="noteDelState"
                                v-model="item.delChecked" shape="square"></van-checkbox>
                        </transition>
                    </template>
                </van-cell>
            </van-cell-group>
        </transition>
        <template #finished>
            <van-empty v-if="noteList.length === 0" description="还没有笔记...">
                <template #image>
                    <person-walk :visible="true"></person-walk>
                </template>
            </van-empty>
        </template>
    </van-list>
</template>

<script lang="ts">
import router from '@/app/router';
import { MemoType, NoteItem, MemoTypeId } from '@/common/constants';
import { calendar } from '@/common/util';
import { defineComponent, PropType } from 'vue';
import { homeStore } from '../../home.store';

export default defineComponent({
    name: 'note-list',
    props: {
        loading: {
            type: Boolean as PropType<boolean>,
            default: true
        },
        finished: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        noteList: {
            type: Array as PropType<Array<NoteItem>>,
            default: () => []
        },
        noteDelState: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        eyes: {
            type: Array as PropType<Array<boolean>>,
            default: () => []
        },
    },
    emits: [
        'noteLoad',
        'update:loading',
        'openKeyboard'
    ],
    setup(props, { emit }) {
        const selectNoteItem = async (id: string, index?: number) => {
            const item: NoteItem = await homeStore.getItemById(MemoType.note, id)
            if (item.verify) {
                emit('openKeyboard', { note: item, index })
            } else {
                router.push({
                    name: 'note',
                    query: {
                        id: (item as NoteItem)[MemoTypeId.note]
                    }
                })
            }
        }
        const onLoad = () => {
            emit('noteLoad', 'noteLoad')
        }

        const updateLoading = (e: any) => {
            emit('update:loading', e)
        }
        return {
            selectNoteItem,
            updateLoading,
            onLoad,
            calendarFn: (date: any) => {
                return calendar(new Date(date))
            },
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

    .van-note-box {
        .van-note-value {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .time {
                flex: 1;
                font-size: 10px;
            }

            .eyeStatus {
                margin-left: 16px;
            }
        }

        .note-right-box {
            margin-left: 6px;
        }
    }
}
</style>