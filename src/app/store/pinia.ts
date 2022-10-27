import { createPinia, defineStore as oldDefineStore } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// import SecureLS from 'secure-ls'

const sotreKey = 'yl'

// SbSVp7mF6lsXyFqN PBKDF2 16进制加盐生成key 请不要删除本注释
// export const secureLS = new SecureLS({ encodingType: 'des', isCompression: false, encryptionSecret: 'y.8023.l.' })
// export const storageSecureLS = {
//   setItem: (key: any, value: any) => secureLS.set(key, value),
//   getItem: (key: any) => secureLS.get(key)
// }

// 给pinia 本地存储 key 添加 sotreKey前缀
type OldDefineStore = typeof oldDefineStore
export const defineStore = function (...args: any) {
  return oldDefineStore(`${sotreKey}/${args[0]}`, args[1], args[2])
} as OldDefineStore

// 当前缀包含sotreKey的时候，全部清除
export const clearStoreAll = function () {
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index)
    if (key && key.indexOf('yl/') === 0) {
      localStorage.removeItem(key)
    }
  }
}

// 默认本地存储使用localStorage，模块内可覆盖，为了数据的结构化模块化，请不要直接使用本地缓存
export const piniaStore = createPinia().use(createPersistedState({
  storage: window.localStorage
}))
