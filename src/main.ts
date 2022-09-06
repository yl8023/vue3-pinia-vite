import { createApp } from 'vue'
import App from './App.vue'
import router from '@/app/router'
import moment from 'moment/moment'
import 'moment/locale/zh-cn'
import { piniaStore } from '@/app/store/pinia'
import components from '@/app/components'
import "vant/lib/index.css";
const app = createApp(App).use(router).use(piniaStore).use(components)

app.mount('#app')
export { app, moment }
