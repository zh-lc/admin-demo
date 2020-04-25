import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

import { constantRoutes, asyncRoutes } from '@/router/routers'
import { deepClone } from '@/utils'
import path from 'path'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    routes: []
  }
}

const generateTree = (routes, basePath = '/', checkedKeys) => { // 根据后台传回的权限解析成路由 routes 是路由配置文件  checkedKeys 后台传回的数据 是素组
  const res = []

  for (const route of routes) {
    const routePath = path.resolve(basePath, route.path)

    // recursive child routes
    if (route.children) {
      route.children = generateTree(route.children, routePath, checkedKeys)
    }

    if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
      res.push(route)
    }
  }
  return res
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTES: (state, routes) => {
    state.routes = [...constantRoutes, ...routes]
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const roles = window.localStorage.rols ? JSON.parse(window.localStorage.rols) : []
      const filter_page = []
      let roles_page = roles.filter(item => {
        if (item.includes('-')) {
          filter_page.push(item.split('-')[0])
          return false
        }
        return true
      })
      roles_page = Array.from(new Set([...roles_page, ...filter_page]))
      console.log(roles_page)
      console.log(filter_page)
      const routers = generateTree(deepClone(asyncRoutes), '/', roles_page)
      commit('SET_NAME', 'name')
      commit('SET_ROLES', roles)
      commit('SET_ROUTES', routers)
      resolve(routers)
      // commit('SET_ROLES', [])
      // resolve([])
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

