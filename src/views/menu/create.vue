<template>
  <div class="menu-create">
    <!-- 将添加功能封装到了单独组件 -->
    <create-or-edit></create-or-edit>
  </div>
</template>

<script>
import createOrEdit from './components/createOrEdit'
export default {
  name: 'MenuCreate',
  components: {
    createOrEdit
  }
}
</script>

<style lang="scss" scoped>

</style>
