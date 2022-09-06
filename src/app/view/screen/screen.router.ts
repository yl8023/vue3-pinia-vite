export function ScreenRoute (path = 'screen', name = path) {
    return {
      path: `/${path}`,
      component: () => import(/* webpackChunkName: "viewer" */ './screen.vue'),
      name,
      meta: {
        name: 'screen',
        index: 0
      }
    }
  }