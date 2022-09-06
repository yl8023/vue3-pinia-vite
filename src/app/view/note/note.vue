<template>
    <div class="note-content">
        <van-nav-bar :title="noteItem.name">
            <template #left>
                <van-icon name="arrow-left" @click="cancel" color="#000" />
            </template>
            <template #right>
                <span @click="modifyStart" :class="{'can-not-save': !quillSave}">保存</span>
            </template>
        </van-nav-bar>
        <div class="text-body">
            <quill-com ref="quillRef" v-model:toSave="quillSave" @upChange="quillChange"></quill-com>
            <span class="body-len">共{{ noteContent.length || 0 }}字</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, Ref, ref, toRaw } from "vue";
import { routerCancel } from "@/common/util";
import { noteStore } from "./note.store";
import { MemoType, MemoTypeId, NoteContent, NoteItem } from "@/common/constants";
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";
import { Dialog } from "vant";

export default defineComponent({
    name: 'note',
    components: {
        // quillEditor
    },
    setup() {
        const route: RouteLocationNormalizedLoaded = useRoute()
        const noteItem: Ref<NoteItem> = ref({} as NoteItem)  //笔记本对象
        const noteContent: NoteContent = reactive({
            [MemoTypeId.note]: '',
            type: 0,
            body: '[]',
            length: 0
        }) //内容对象
        const quillSave = ref(false)  //是否修改
        const quillRef = ref()  //quill组件实例
        onMounted(async () => {
            noteItem.value = await noteStore.getNoteItem(MemoType.note, route.query.id as string)
            noteContent[MemoTypeId.note] = noteItem.value[MemoTypeId.note]
            noteStore.getNoteContent(route.query.id as string).then((note?: NoteContent) => {
                if(note) {
                    noteContent.body = note.body
                    noteContent.id = note.id  //indexDb表的唯一id  如果有就赋值，方便更新对应数据，没有则是添加新数据，自动生成id
                    noteContent.length = note.length
                    quillRef.value.quillFocus(note.body);
                }
            })
            
        })
        const quillChange = (quillEditor: {delta: string, toSave: boolean, length: number}) => {
            noteContent.body = quillEditor.delta
            noteContent.length = quillEditor.length
        }
        onUnmounted(() => {

        })
        const modifyStart = () => {

            if (quillSave.value) {
                Dialog.confirm({
                    title: '请确认',
                    message: '是否保存当前修改。',
                }).then(() => {
                    noteStore.setNoteContent(noteContent)
                    noteStore.setNoteItem(MemoType.note, toRaw(noteItem.value))
                    quillSave.value = false
                }).catch(() => {
                    quillSave.value = false
                })
            }
        }
        const cancel = () => {

            routerCancel()
        }
        return {
            cancel,
            noteItem,
            noteContent,
            quillSave,
            quillChange,
            modifyStart,
            quillRef
        }
    }
})
</script>

<style lang="less">
.note-content {
    height: 100vh;
    .can-not-save{
        color: #eee;
    }
    .text-body {
        height: calc(100vh - 46px);
        overflow-y: auto;
        background-color: #fff;
        position: relative;

        .body-len {
            position: absolute;
            top: 36px;
            right: 12px;
            color: #999;
            font-size: 10px;
        }
    }
}
</style>