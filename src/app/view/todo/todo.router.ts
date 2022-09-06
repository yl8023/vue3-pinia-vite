export function TodoRoute (path = 'todo', name = path) {
    return {
      path: `/${path}`,
      component: () => import(/* webpackChunkName: "viewer" */ './todo.vue'),
      name,
      meta: {
        name: 'todo',
        index: 2
      },
    }
  }