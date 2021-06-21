<template>
  <div class="menu-create-or-update">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select
            v-model="form.parentId"
            placeholder="请选择活动区域"
          >
          <!-- 无上级菜单 -->
          <el-option label="无上级菜单" :value="-1"></el-option>
          <!-- 选择一级菜单 -->
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="shown">
          <el-radio-group v-model="form.shown">
            <!-- label 的数据会在选择后设置给 v-model 的 shown -->
            <!-- boolean 的时候，需要使用 v-bind形式，即:label -->
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, createOrUpdateMenu } from '@/services/menu'
export default {
  name: 'CreateOrEdit',
  props: {
    // 通过 props 接收父组件传值，判断当前是哪种功能（添加或编辑）
    isEdit: {
      type: Boolean,
      // 默认为添加功能
      default: false
    }
  },
  data () {
    return {
      // 表单数据
      form: {
        name: '',
        href: '',
        parentId: -1,
        description: '',
        icon: '',
        shown: false,
        orderNum: 0
      },
      // 存储上级菜单数据
      parentMenuList: []
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      console.log(this.form)
      // 1. 表单验证
      // 发送请求
      const { data } = await createOrUpdateMenu(this.form)
      console.log('添加菜单成功', data)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({ name: 'menu' })
      } else {
        this.$message.error(data.mesg)
      }
    },
    // 加载上级菜单信息
    async loadMenuInfo () {
      // 检测是否存在路由参数 id，并进行对应处理
      const id = this.$route.params.id || -1
      // console.log(this.$route.params.id)
      // 请求上级菜单数据
      const { data } = await getEditMenuInfo(id)
      console.log('上级菜单数据', data)
      if (data.code === '000000') {
        // 将上级菜单数据保存，进行绑定
        this.parentMenuList = data.data.parentMenuList
        // 检测是否存在菜单数据 menuInfo，如果存在更新给 form 即可
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
