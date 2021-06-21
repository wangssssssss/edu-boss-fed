<template>
    <div class="resource-list">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <!-- 使用 form 表单：行内表单 -->
          <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
            <el-form-item label="资源名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="资源名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="资源路径" prop="url">
              <el-input
                v-model="form.url"
                placeholder="资源路径"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="资源分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
                <!-- 请求接口进行下拉菜单项设置 -->
                <el-option
                  v-for="item in resourceCategories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="onReset"
              >重置</el-button>
              <el-button
                type="primary"
                @click="onSubmit"
                :disabled="loading"
              >查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="resources"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            label="编号"
            type="index"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="资源名称">
          </el-table-column>
          <el-table-column
            prop="url"
            label="资源路径">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <!-- 设置过滤器需要使用作用域插槽获取数据 -->
          <el-table-column
            label="添加时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                size="mini"
              >编辑</el-button>
              <el-button
                @click="handleDelete(scope.row)"
                size="mini"
                type="danger"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件结构 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.current"
          background
          :disabled="loading"
          :page-sizes="[10, 15, 20]"
          :page-size="form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>
<script>
import { getResourcePages, getResourceCategories } from '@/services/resource'
export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        // 当前页码
        current: 1,
        // 每页显示的数据条数
        size: 10,
        // 资源名称
        name: '',
        // 资源路径
        url: '',
        // 资源分类id
        categoryId: ''
      },
      // 数据总条数
      total: 10,
      // 存储资源列表数据
      resources: [],
      // 存储资源分类
      resourceCategories: [],
      // 用于保存加载状态
      loading: false
    }
  },
  created () {
    // 加载资源数据
    this.loadResources()
    // 加载资源分类数据
    this.loadResourcesCategories()
  },
  methods: {
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      // 由于修改了每页显示条数，应当将页数还原默认值1
      this.form.current = 1
      this.loadResources()
    },
    // 页码改变时触发
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    },
    // 查询
    onSubmit () {
      console.log('this.form', this.form)
      this.form.current = 1
      this.loadResources()
    },
    // 重置
    onReset () {
      this.$refs.form.resetFields()
    },
    // 加载资源列表数据
    async loadResources () {
      // 开启加载状态
      this.loading = true
      const { data } = await getResourcePages(this.form)
      // console.log('成功获取资源列表数据', data)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.total = data.data.total
        // 取消加载状态
        this.loading = false
      }
    },
    // 加载资源分类
    async loadResourcesCategories () {
      const { data } = await getResourceCategories()
      console.log('成功获取资源分类数据', data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    // 编辑
    handleEdit (row) {
    },
    // 删除
    handleDelete (row) {
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      console.log('date', date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
