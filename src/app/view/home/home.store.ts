import { db } from "@/app/store/db"
import { defineStore } from "@/app/store/pinia"
import { NoteItem, TodoItem, MemoType, MemoTypeId } from "@/common/constants"
export const homeStore = defineStore('homeStore', {
  state: () => ({
    maps: {
      [MemoType.note]: [] as NoteItem[], //笔记本列表
      [MemoType.todo]: [] as TodoItem[], //待办列表
    },
    delState: {
      [MemoType.note]: false, //批量删除
      [MemoType.todo]: false  //批量删除
    },
  }),
  getters: {
    Maps(state) {
      return state.maps
    },
    DelState(state) {
      return state.delState
    },
  },
  actions: {
    /**
     * 列表添加item
     * @param type 
     * @param item 
     */
    addItem(type: MemoType, item: any) {
      item[type + 'Id'] = new Date().getTime() //添加唯一uuid
      item.updateTime = new Date().getTime()
      db[type].put({ ...item }).then((id) => {
        this.setMap(type)
        this.maps[type].push({
          ...item,
          isShow: false,
          id
        })
      })
    },
    async setMap(type: MemoType) {
      const stringMap = JSON.stringify(this.maps[type])
      const dbDate = await db[type].toArray()
      if (stringMap !== JSON.stringify(dbDate)) {
        this.maps[type] = dbDate.map((item: any) => {
          item.isShow = true
          return item
        })
      }
    },
    /**
     * 批量删除
     * @param type 
     * @param ids 
     */
    deleteItem(type: MemoType, ids: any[]) {
      db[type].bulkDelete(ids).then(() => {
        const list = this.maps[type]
        list.map((item: any) => {
          if (ids.indexOf(item.id) !== -1) {
            item.isShow = false
          }
        })
        this.setMap(type)
      })

    },
    /**
     * 打开批量管理
     * @param type 
     */
    openDel(type: MemoType) {
      this.delState[type] = true
    },
    /**
     * 关闭批量管理
     * @param type 
     */
    closeDel(type: MemoType) {
      this.delState[type] = false
      this.maps[type].forEach((item: any) => {
        item.delChecked = false
      })
    },
    /**
     * 更新item
     * @param type 
     * @param data 
     */
    setItemById(type: MemoType, data: NoteItem | TodoItem): Promise<any> {
      data.updateTime = new Date().getTime()
      return db[type].put(data)
    },
    /**
     * 获取item
     * @param type 
     * @param id 
     */
    getItemById(type: MemoType, id: string): Promise<any> {
      return db[type].where(MemoTypeId[type]).equals(id).first()
    }
  },
  persist: {
    paths: ['maps'],
    storage: window.localStorage
  }
})()