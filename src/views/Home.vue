<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <h2>主页</h2>
      <div class="user-info">
        <el-avatar 
          :size="32" 
          :src="userInfo ? userInfo.avatarUrl : ''" 
          class="user-avatar"
          @click="handleAvatarClick"
        />
        <el-button 
          type="default"
          size="small"
          @click="handleLogout"
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? '登出中...' : '登出' }}
        </el-button>
      </div>
    </div>

    <!-- 推文列表 -->
    <div class="posts-container">
      <div v-for="post in posts" :key="post.id">
        <!-- 普通推文 -->
        <post-norm 
          v-if="post.postType === 0" 
          :post-id="post.id"
          class="post-item"
        />
        <!-- 转发推文 -->
        <post-re-post 
          v-if="post.postType === 1" 
          :post-id="post.id"
          class="post-item"
        />
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="posts.length > 0">
        <el-button 
          v-if="!isEnd" 
          type="primary" 
          :loading="loading" 
          @click="loadMore"
          class="load-more-btn"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </el-button>
        <p v-else class="end-text">已经到底啦 ~</p>
      </div>
    </div>

    <!-- 发布推文按钮 -->
    <div class="post-btn-container">
      <el-button 
        class="post-btn" 
        type="primary" 
        circle 
        @click="showUploadDialog = true"
      >
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>

    <!-- 发布推文对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      :show-close="false"
      width="600px"
      class="upload-dialog"
      top="5vh"
      :modal="true"
      :append-to-body="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <post-norm-upload 
        @close="showUploadDialog = false" 
        @success="handleUploadSuccess"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { authApi } from '../api/auth'
import api from '../api'

// 动态导入组件
const PostNorm = defineAsyncComponent(() => import('../components/PostNorm.vue'))
const PostRePost = defineAsyncComponent(() => import('../components/PostRePost.vue'))
const PostNormUpload = defineAsyncComponent(() => import('../components/PostNormUpload.vue'))

// 路由
const router = useRouter()

// 用户信息接口
interface UserInfo {
  id: string
  accountId: string
  nickname: string
  avatarUrl: string
  backgroundUrl: string
  bio: string | null
  createTime: string
  updateTime: string
}

// 状态
const token = ref(localStorage.getItem('token') || '')
const loading = ref(false)
const pageNumber = ref(1)
const isEnd = ref(false)
const posts = ref<Array<{id: string, postType: number, deleted: boolean}>>([])
const showUploadDialog = ref(false)
const userInfo = ref<UserInfo | null>(null)

// 获取推文列表
const fetchPosts = async (page: number) => {
  try {
    const response = await api.get(`/post/list/${page}`, {
      transformResponse: [(data) => {
        // 处理大数字
        const processedData = data.replace(/"id"\s*:\s*(\d{15,})/g, '"id":"$1"')
        return JSON.parse(processedData)
      }]
    })
    
    const { code, data } = response.data
    if (code === '1' && Array.isArray(data)) {
      if (data.length === 0) {
        isEnd.value = true
      } else {
        posts.value = page === 1 ? data : [...posts.value, ...data]
      }
    }
  } catch (error) {
    ElMessage.error('获取推文列表失败')
  }
}

// 获取用户信息
const fetchUserInfo = async () => {
  // 先尝试从本地存储获取
  const localUserInfo = localStorage.getItem('userInfo')
  if (localUserInfo) {
    try {
      userInfo.value = JSON.parse(localUserInfo)
      return
    } catch (error) {
      console.error('解析本地用户信息失败:', error)
    }
  }

  // 本地没有或解析失败时，从服务器获取
  try {
    const response = await api.get('/my/info/show', {
      transformResponse: [(data) => {
        // 处理大数字
        const processedData = data.replace(/"(id|accountId)"\s*:\s*(\d{15,})/g, '"$1":"$2"')
        return JSON.parse(processedData)
      }]
    })
    
    const { code, data } = response.data
    if (code === '1' && data) {
      userInfo.value = data
      // 保存用户信息到本地存储
      localStorage.setItem('userInfo', JSON.stringify(data))
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 加载更多
const loadMore = async () => {
  if (loading.value) return
  
  loading.value = true
  pageNumber.value++
  await fetchPosts(pageNumber.value)
  loading.value = false
}

// 登出
const handleLogout = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    await authApi.logout()
    ElMessage.success('登出成功')
  } catch (error) {
    ElMessage.error('登出请求失败')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    loading.value = false
    router.push('/')
  }
}

// 处理头像点击
const handleAvatarClick = () => {
  if (userInfo.value?.accountId) {
    router.push(`/info/${userInfo.value.accountId}`)
  }
}

// 初始化
const init = async () => {
  if (!token.value) {
    router.push('/')
    return
  }
  
  // 先获取用户信息（优先使用本地存储）
  await fetchUserInfo()
  
  // 获取推文列表
  loading.value = true
  await fetchPosts(1)
  loading.value = false
}

// 处理上传成功
const handleUploadSuccess = () => {
  // 重新加载第一页数据
  pageNumber.value = 1
  isEnd.value = false
  fetchPosts(1)
}

// 页面加载时初始化
init()
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar h2 {
  font-size: 20px;
  font-weight: bold;
  color: #0F1419;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  cursor: pointer;
  transition: opacity 0.2s;
}

.user-avatar:hover {
  opacity: 0.8;
}

.posts-container {
  padding-bottom: 20px;
}

.post-item {
  border-bottom: 1px solid #eee;
}

.post-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.load-more {
  padding: 20px;
  text-align: center;
}

.load-more-btn {
  width: 200px;
  border-radius: 20px;
  background-color: #1DA1F2;
  border: none;
}

.load-more-btn:hover {
  background-color: #1a91da;
}

.end-text {
  color: #536471;
  font-size: 14px;
  margin: 0;
}

.post-btn-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}

.post-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #1DA1F2;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.post-btn:hover {
  background-color: #1a91da;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.post-btn :deep(.el-icon) {
  font-size: 24px;
}

.upload-dialog {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.upload-dialog .el-dialog__body) {
  padding: 0;
}
</style> 