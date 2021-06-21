<template>
  <div class="menu-edit">
    <!-- 引入并通过 is-edit -->
    <create-or-edit :is-edit="true"></create-or-edit>
  </div>
</template>

<script>
import createOrEdit from './components/createOrEdit'
export default {
  name: 'MenuEdit',
  components: {
    createOrEdit
  }
}
</script>

<style lang="scss" scoped>

</style>
