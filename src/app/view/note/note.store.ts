import { db } from "@/app/store/db";
import { defineStore } from "@/app/store/pinia";
import { MemoType, MemoTypeId, NoteContent, NoteItem } from "@/common/constants";
import { homeStore } from "../home/home.store";

export const noteStore = defineStore('noteStore', {
    state: () =>({
        noteData: '' as string
    }),
    getters: {},
    actions: {
        getNoteItem(type: MemoType, id: string) {
            return homeStore.getItemById(type, id)
        },
        setNoteItem (type: MemoType, note: NoteItem) {
            homeStore.setItemById(type, note)
        },
        getNoteContent (id: string) {
            return db['noteContent'].where(MemoTypeId.note).equals(id).first()
        },
        setNoteContent (content: NoteContent) {
            console.log(content)
            db['noteContent'].put({...content})
        }
    }
})()