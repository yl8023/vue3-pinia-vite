import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const guard = (to:RouteLocationNormalized, from:RouteLocationNormalized, next:NavigationGuardNext) => {
    next()
}