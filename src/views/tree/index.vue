<template>
  <div class="app-container">
    <!-- <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" /> -->

    <el-tree
      ref="tree"
      :check-strictly="false"
      :data="routesData"
      :props="defaultProps"
      :default-checked-keys="defaultKeys"
      show-checkbox
      node-key="path"
      class="permission-tree"
    />

    <el-button @click.native="confirmRole">confirmRole</el-button>

  </div>
</template>

<script>
import path from 'path'
import { asyncRoutes } from '@/router/routers'
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        title: 'label'
      },
      routesData: [],
      defaultKeys: []
      // defaultKeys: [
      //   '/tree',
      //   '/tree',
      //   '/form',
      //   '/form/index'
      // ]
    }
  },
  created() {
    this.routesData = this.generateRoutes(asyncRoutes)
    this.defaultKeys = this.$store.getters.roles || []
  },
  methods: {
    confirmRole() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      console.log(checkedKeys)
      localStorage.rols = JSON.stringify(checkedKeys)
    },
    generateRoutes(routers, basePath = '/') {
      const res = []
      for (const route of routers) {
        const data = {
          path: path.resolve(basePath, route.path),
          id: path.resolve(basePath, route.path),
          label: route.meta && route.meta.title
        }

        const btns = []
        if (route.meta && route.meta.roles && route.meta.roles.length) {
          const btnsName = {
            'add': '增加',
            'del': '删除',
            'update': '修改',
            'select': '查询'
          }
          route.meta.roles.forEach(btn => {
            btns.push({
              path: `${path.resolve(basePath, route.path)}-${btn}`,
              id: `${path.resolve(basePath, route.path)}-${btn}`,
              label: `${btnsName[btn]}`
            })
          })
        }
        data.children = [...btns]
        if (route.children && route.children.length) {
          const children = this.generateRoutes(route.children, data.path)
          data.children = [...data.children, ...children]
        }
        res.push(data)
      }

      return res
    }
  }
}
</script>

