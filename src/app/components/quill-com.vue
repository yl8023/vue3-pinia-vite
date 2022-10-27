<template>
    <div ref="quillRef" class="quill-body">

    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, Ref, ref, toRefs, watchEffect } from "vue";
import Quill from "quill";
import 'quill/dist/quill.snow.css';
import { QuillItem } from "@/common/constants";
export default defineComponent({
    name: 'quill-com',
    props: {
        toSave: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    emits: [
        'update:toSave',
        'upChange'
    ],
    setup(props, { emit }) {
        const quillRef = ref()
        let quillInstance: any;
        onMounted(() => {
            quillInstance = new Quill(quillRef.value, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [
                            'bold',
                            'italic',
                            'underline',
                            'strike',
                            'blockquote',
                            'code-block',
                            { 'header': 1 },
                            { 'header': 2 },
                            { 'list': 'ordered' },
                            { 'list': 'bullet' },
                            { 'script': 'sub' },
                            { 'script': 'super' }
                        ],        // 下标，上标，粗体，斜体，下划线，删除线，标记，code，标题1，标题2，有序列表，无序列表
                        [
                            { 'indent': '-1' },
                            { 'indent': '+1' },
                            { 'color': [] },
                            { 'background': [] },
                            'link',
                            'image',
                            'video',
                            'clean'
                        ],      // 缩进，推移，字体颜色，背景颜色，链接，图片，视频，清除格式
                    ],
                },
                placeholder: '请输入...',
                readOnly: false,
            });
            quillInstance.on('text-change', (delta: { ops: Array<QuillItem> }, oldDelta: { ops: Array<QuillItem> }, source: string) => {

                switch (source) {
                    case 'user':
                        if (!props.toSave) {
                            console.log(props.toSave,'props.toSave')
                            emit('update:toSave', true)
                        }
                        const qcontent: { ops: Array<QuillItem> } = quillInstance.getContents()
                        const qlength: number = quillInstance.getLength()
                        emit('upChange', { delta: JSON.stringify(qcontent.ops), length: qlength })
                        break;
                    case 'api':
                        break;
                }
            })
        })

        const quillFocus = (content: string) => { //首次加载设置内容
            quillInstance.once('selection-change', () => {
                const quillContent: Array<QuillItem> = JSON.parse(content)
                quillInstance.setContents(quillContent)
            })
            quillInstance.focus();
        }

        return {
            quillRef,
            quillFocus
        }
    }
})
</script>
<style lang="less" scoped>
.quill-body {
    width: 100%;
    height: calc(100% - 66px);
}
</style>