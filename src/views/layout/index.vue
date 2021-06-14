<template>
 <el-container>
  <el-aside width="200px">
    <!-- 侧边栏组件 -->
    <app-aside></app-aside>
  </el-aside>
  <el-container>
    <el-header>Header</el-header>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>
<script>
// 引入侧边栏组件
import AppAside from './components/AppAside.vue'
export default {
  name: 'Layout',
  components: {
    AppAside
  }
}
</script>
<style lang="scss" scoped>
  .el-container {
    height: 100vh; //vh 视口高度的百分比，一个 vh 就是视口高度的1%
    min-width: 980px;
  }
  .el-aside {
    background-color: #d3dce6;
  }
  .el-header {
    background-color: #d3c0d1;
  }
  .el-main {
    background-color: #e9eef3;
  }
</style>
