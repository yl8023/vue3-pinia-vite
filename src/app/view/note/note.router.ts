export function NoteRoute (path = 'note', name = path) {
    return {
      path: `/${path}`,
      component: () => import(/* webpackChunkName: "viewer" */ './note.vue'),
      name,
      meta: {
        name: 'note',
        index: 2
      },
    }
  }