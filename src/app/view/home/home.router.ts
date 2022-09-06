export function HomeRoute (path = 'home', name = path) {
    return {
      path: `/${path}`,
      component: () => import(/* webpackChunkName: "viewer" */ './home.vue'),
      name,
      meta: {
        name: 'home',
        index: 1
      },
      children: [
        {
          path: 'list/:type',
          component: () => import(/* webpackChunkName: "viewer" */ './component/list/list.vue'),
          name: 'home/list',
          meta: {
            name: 'home/list',
            index: 1
          }
        }
      ]
    }
  }