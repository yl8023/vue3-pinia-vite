import { NoteItem, TodoItem, MemoType, NoteContent } from "@/common/constants";
import Dexie, { Table } from "dexie";

export class ClassedDexie extends Dexie {
    note!: Table<NoteItem>;
    todo!: Table<TodoItem>;
    noteContent!: Table<NoteContent>;
    constructor() {
        super('ylDatabase');
        this.version(6).stores({
            [MemoType.note]: '++id, &noteId, name',
            [MemoType.todo]: '++id, &todoId, name',
            noteContent: '++id, &noteId'
        })
    }
}
export const db = new ClassedDexie()