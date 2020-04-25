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
      localStorage.rols = JSON.stringify(checkedKeys)
    },
    generateRoutes(routers, basePath = '/') {
      const res = []
      for (const route of routers) {
        console.log(route.meta)
        const data = {
          path: path.resolve(basePath, route.path),
          id: path.resolve(basePath, route.path),
          label: route.meta && route.meta.title
        }
        if (route.children && route.children.length) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }

      return res
    }
  }
}
</script>

