<template>
    <div class="menu">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
        </div>
        <!-- 底部菜单列表展示区 -->
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="编号"
            type="index"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="菜单名称"
          >
          </el-table-column>
          <el-table-column
            prop="level"
            label="菜单级数">
          </el-table-column>
          <el-table-column
            prop="icon"
            label="前端图标">
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="排序">
          </el-table-column>
          <el-table-column
            label="操作"
          >
          <template slot-scope="scope">
             <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>
<script>
import { getAllMenus, deleteMenu } from '@/services/menu'
export default {
  name: 'Menu',
  data () {
    return {
      // 表格数据
      tableData: []
    }
  },
  created () {
    // 获取所有菜单
    this.loadAllMenus()
  },
  methods: {
    // 获取所有菜单
    async loadAllMenus () {
      const { data } = await getAllMenus()
      console.log('成功获取所有菜单', data)
      if (data.code === '000000') {
        this.tableData = data.data
      }
    },
    // 编辑
    handleEdit (row) {
      // 设置跳转
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: row.id
        }
      })
    },
    // 删除
    handleDelete (row) {
      console.log(row)
      // 删除确认提示
      this.$confirm('确认删除？', '删除提示')
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteMenu(row.id)
          console.log('删除成功', data)
          if (data.code === '000000') {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        }).finally(() => {
          this.loadAllMenus()
        })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
