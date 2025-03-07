<template>
  <div class="test-container">
    <h2>推文测试</h2>
    <div class="input-section">
      <el-input
        v-model="postId"
        placeholder="请输入推文ID（示例：1890406142111121408）"
        class="post-id-input"
        clearable
      >
        <template #append>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </template>
      </el-input>
    </div>
    
    <div class="post-section" v-if="showPost">
      <el-card v-loading="loading" shadow="never">
        <PostNorm :post-id="postId" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PostNorm from '../components/PostNorm.vue'

const postId = ref('')
const showPost = ref(false)
const loading = ref(false)

const handleSearch = async () => {
  if (!postId.value) return
  loading.value = true
  showPost.value = false // 重置显示状态
  await new Promise(resolve => setTimeout(resolve, 300))
  showPost.value = true
  loading.value = false
}
</script>

<style scoped>
.test-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #409EFF;
}

.input-section {
  margin-bottom: 20px;
}

.post-id-input {
  width: 100%;
}

.post-section {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-card__body) {
  padding: 0;
}
</style> 