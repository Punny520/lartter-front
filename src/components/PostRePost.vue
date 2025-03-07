<template>
  <div class="repost" v-if="postData">
    <!-- 转发人信息 -->
    <div class="repost-header">
      <el-icon class="repost-icon"><RefreshRight /></el-icon>
      <span class="repost-user">{{ userDisplayInfo.nickname }} 转发了</span>
    </div>

    <!-- 被转发的原始推文 -->
    <div class="original-post">
      <post-norm v-if="postData.postRepostDto.originalType === 0" :postId="originalId" />
      <!-- 后续可以添加其他类型的推文组件 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineAsyncComponent } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import api from '../api'

// 用户信息接口
interface UserInfo {
  id: string
  accountId: string
  nickname: string
  avatarUrl: string
  backgroundUrl: string
  bio: string
  createTime: string
  updateTime: string
}

// 转发推文数据接口
interface PostRepostDto {
  id: string
  originalId: string
  originalType: number
  repostBy: string
  createTime: string
}

interface PostData {
  type: number
  postNormDto: null
  postRepostDto: PostRepostDto
  postQuoteDto: null
  postReplyDto: null
}

// 接收推文ID
const props = defineProps<{
  postId?: string
}>()

// 本地状态
const postData = ref<PostData | null>(null)
const userInfo = ref<UserInfo | null>(null)
const originalId = computed(() => postData.value?.postRepostDto.originalId || '')

// 计算用户显示信息
const userDisplayInfo = computed(() => ({
  nickname: userInfo.value?.nickname || '加载中...'
}))

// 获取用户信息
const fetchUserInfo = async (userId: string) => {
  try {
    const response = await api.get(`/my/info/show/${userId}`, {
      transformResponse: [(data) => {
        // 在 JSON.parse 之前处理大数字
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
  }
}

// 获取转发推文数据
const fetchPostData = async (id: string) => {
  try {
    const response = await api.get(`/post/get/${id}`, {
      transformResponse: [(data) => {
        // 在 JSON.parse 之前处理大数字
        const processedData = data.replace(/:\s*(\d{15,})(,|\})/g, ':"$1"$2')
        return JSON.parse(processedData)
      }]
    })
    const { code, data } = response.data
    if (code === '1' && data) {
      postData.value = data
      // 获取转发人信息
      if (data.postRepostDto?.repostBy) {
        fetchUserInfo(data.postRepostDto.repostBy)
      }
    }
  } catch (error) {
    ElMessage.error('获取推文失败')
  }
}

// 监听postId变化
watch(() => props.postId, (newId) => {
  if (newId) {
    fetchPostData(newId)
  }
}, { immediate: true })

// 动态导入 PostNorm 组件
const PostNorm = defineAsyncComponent(() => import('./PostNorm.vue'))
</script>

<style scoped>
.repost {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.repost-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #536471;
  font-size: 13px;
}

.repost-icon {
  font-size: 16px;
}

.repost-user {
  font-weight: 500;
  cursor: pointer;
}

.repost-user:hover {
  text-decoration: underline;
}

.original-post {
  margin-left: 8px;
}
</style> 