
interface myItem {
    name: string;
    id?: number;
    createTime?: number;
    updateTime?: number;
    isShow?: boolean;
    delChecked?: boolean;
}
export interface QuillItem {
    insert: string | {[key: string]: any};
    attributes?: {[key: string]: any};
} 
export interface NoteContent {
    id?: number;
    [MemoTypeId.note]?: string;
    type?: number;
    body?: string; //Array<QuillItem>
    length?: number;
}
/**
 * 笔记本对象
 */
export interface NoteItem extends myItem {
    [MemoTypeId.note]?: string;
    label?: string; //描述
    password?: string; //密码
    verify?: boolean;  //是否有密码
    content?: NoteContent;
}
/**
 * 计划目标
 */
// export interface CycleItem {
//     call: string;  // 0：'日' | 1：'周' | 2：'月' | 3：'年'
//     count?: number; //打卡计数
//     state?: boolean; //当前打卡状态
//     stateDateList?: Array<any>; //打卡日期列表
// }
/**
 * 待办对象
 */
export interface TodoItem extends myItem {
    [MemoTypeId.todo]?: string;
    datetime?: number;  //目标日期
    type?: number;  //0: 待办   1: 计划
    complete?: boolean; //是否完成
    call?: string;
    count?: number; //打卡计数
    state?: boolean; //当前打卡状态
    stateDateList?: Array<any>; //打卡日期列表
}

/**
 * 密码键盘对象
 */
export interface Keyboard {
    note?: NoteItem,
    overlay: boolean,
    show?: boolean,
    value?: string,
    title?: string,
    index?: number, //对应的note对象index
}

export enum MemoTypeId {
    note = 'noteId',
    todo = 'todoId'
}

export enum MemoType {
    note = 'note',
    todo = 'todo'
}
export enum TodoType{
    cycle = 'cycle',
    time = 'time'
}