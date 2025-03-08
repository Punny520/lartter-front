<template>
  <div class="my-info-container">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <el-button class="back-btn" text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <div class="user-title">
        <h2>{{ userInfo ? userInfo.nickname : '' }}</h2>
        <span class="post-count" v-if="postCount !== null">{{ postCount }} 推文</span>
      </div>
    </div>

    <!-- 用户信息区域 -->
    <div class="user-profile">
      <!-- 背景图 -->
      <div class="background-image">
        <img :src="userInfo ? userInfo.backgroundUrl : ''" alt="背景图" />
      </div>

      <!-- 头像和基本信息 -->
      <div class="profile-info">
        <div class="avatar-container">
          <el-avatar 
            :size="120" 
            :src="userInfo ? userInfo.avatarUrl : ''" 
            class="profile-avatar"
          />
        </div>

        <div class="user-details">
          <h1>{{ userInfo ? userInfo.nickname : '' }}</h1>
          <p class="bio" v-if="userInfo && userInfo.bio">{{ userInfo.bio }}</p>
          <p class="join-date">
            <el-icon><Calendar /></el-icon>
            加入于 {{ formatDate(userInfo ? userInfo.createTime : '') }}
          </p>
        </div>
      </div>
    </div>

    <!-- 选项卡 -->
    <div class="tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="推文" name="posts">
          <!-- 推文列表将在这里显示 -->
          <div class="placeholder">推文列表开发中...</div>
        </el-tab-pane>
        <el-tab-pane 
          v-if="isCurrentUser" 
          label="喜欢" 
          name="likes"
        >
          <!-- 点赞列表将在这里显示 -->
          <div class="placeholder">点赞列表开发中...</div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Calendar } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import api from '../api'

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

const route = useRoute()
const router = useRouter()

// 状态
const userInfo = ref<UserInfo | null>(null)
const activeTab = ref('posts')
const postCount = ref<number | null>(null)
const loading = ref(false)

// 判断是否是当前用户
const isCurrentUser = computed(() => {
  const localUserInfo = localStorage.getItem('userInfo')
  if (!localUserInfo) return false
  
  const localUser = JSON.parse(localUserInfo)
  return localUser.accountId === route.params.accountId
})

// 格式化日期
const formatDate = (date: string | undefined) => {
  if (!date) return ''
  return dayjs(date).format('YYYY年M月')
}

// 获取用户信息
const fetchUserInfo = async () => {
  const accountId = route.params.accountId
  if (!accountId) return
  
  // 如果是当前用户，直接使用本地存储的信息
  if (isCurrentUser.value) {
    const localUserInfo = localStorage.getItem('userInfo')
    if (localUserInfo) {
      userInfo.value = JSON.parse(localUserInfo)
      return
    }
  }
  
  loading.value = true
  try {
    const response = await api.get(`/my/info/show/${accountId}`, {
      transformResponse: [(data) => {
        // 处理大数字
        const processedData = data.replace(/"(id|accountId)"\s*:\s*(\d{15,})/g, '"$1":"$2"')
        return JSON.parse(processedData)
      }]
    })
    
    const { code, data } = response.data
    if (code === '1' && data) {
      userInfo.value = data
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

// 初始化
fetchUserInfo()
</script>

<style scoped>
.my-info-container {
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
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  font-size: 20px;
  color: #000;
}

.user-title {
  display: flex;
  flex-direction: column;
}

.user-title h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.post-count {
  font-size: 13px;
  color: #536471;
}

.background-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #ccc;
}

.background-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  padding: 0 16px;
  margin-bottom: 16px;
}

.avatar-container {
  margin-top: -60px;
  margin-bottom: 16px;
}

.profile-avatar {
  border: 4px solid #fff;
  background-color: #fff;
}

.user-details h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 4px 0;
}

.bio {
  font-size: 15px;
  color: #0F1419;
  margin: 12px 0;
}

.join-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #536471;
  font-size: 14px;
  margin: 12px 0;
}

.tabs {
  border-top: 1px solid #eee;
}

.tabs :deep(.el-tabs__nav) {
  width: 100%;
}

.tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 16px;
}

.tabs :deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  font-size: 15px;
}

.placeholder {
  padding: 20px;
  text-align: center;
  color: #536471;
}
</style> 