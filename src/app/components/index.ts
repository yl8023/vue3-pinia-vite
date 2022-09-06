import * as Components from './output'

export default {
  install: (app:any) => {
    for (const [name, Component] of Object.entries(Components)) {
      app.component(Component.name || name, Component)
    }
  }
}
