import {
    createRouter,
    createWebHashHistory,
    NavigationGuardNext,
    RouteLocationNormalized,
    RouteRecordRaw
  } from 'vue-router'
  import { guard } from './guard'
  import { HomeRoute } from '../view/home/home.router'
  import { ScreenRoute } from '../view/screen/screen.router'
  import { NoteRoute } from '../view/note/note.router'
  import { TodoRoute } from '../view/todo/todo.router'
  import { SettingRoute } from '../view/setting/setting.router'

  const routes: Array<RouteRecordRaw> = [
    //路由基础
    {
      path: '/',
      name: 'index',
      redirect: 'screen',
      meta: {
        name: '首屏加载'
      }
    },
    ScreenRoute(),
    HomeRoute(),
    NoteRoute(),
    TodoRoute(),
    SettingRoute(),
  ]
  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })

  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => guard(to, from, next))
  export default router