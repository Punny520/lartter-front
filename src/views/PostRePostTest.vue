<template>
  <div class="post-repost-test">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <h3>转发推文测试</h3>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item label="转发推文ID">
          <el-input v-model="form.postId" placeholder="请输入转发推文ID" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="post-container" v-if="showPost">
        <post-re-post :post-id="form.postId" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const PostRePost = defineAsyncComponent(() => import('../components/PostRePost.vue'))

const form = ref({
  postId: '1890406787639672832' // 默认测试ID
})

const showPost = ref(false)

const handleQuery = () => {
  showPost.value = false
  // 使用 nextTick 确保组件重新渲染
  setTimeout(() => {
    showPost.value = true
  }, 0)
}
</script>

<style scoped>
.post-repost-test {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.test-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-container {
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}
</style> 