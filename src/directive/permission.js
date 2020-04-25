import store from '@/store'
import router from '@/router'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const roles = store.getters && store.getters.roles
    const path = `${router.app._route.path}-${value}`
    console.log(roles)
    console.log(path)
    if (value) {
      if (!roles.includes(path)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need button type! Like v-permission="'add'"`)
    }
  }
}
