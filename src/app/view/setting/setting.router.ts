export function SettingRoute (path = 'setting', name = path) {
    return {
      path: `/${path}`,
      component: () => import(/* webpackChunkName: "viewer" */ './setting.vue'),
      name,
      meta: {
        name: 'setting',
        index: 2
      },
    }
  }