<template>
  <div class="home-container">
    <h1>登录成功</h1>
    <p>Token: {{ token }}</p>
    <el-button 
      type="primary" 
      @click="handleLogout"
      :loading="loading"
      :disabled="loading"
    >
      {{ loading ? '登出中...' : '登出' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '../api/auth'

const router = useRouter()
const token = ref(localStorage.getItem('token') || '')
const loading = ref(false)

const handleLogout = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    await authApi.logout()
    ElMessage.success('登出成功')
  } catch (error) {
    ElMessage.error('登出请求失败')
  } finally {
    // 无论如何都删除本地token并跳转
    localStorage.removeItem('token')
    loading.value = false
    router.push('/')
  }
}

// 如果没有 token，跳转到登录页
onMounted(() => {
  if (!token.value) {
    router.push('/')
  }
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  text-align: center;
}
</style> 