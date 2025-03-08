<template>
  <div class="post" v-if="effectivePostData">
    <div class="post-content">
      <!-- 用户信息 -->
      <div class="user-info">
        <el-avatar 
          :size="40" 
          :src="userDisplayInfo.avatarUrl"
          class="user-avatar"
        />
        <span class="user-nickname">{{ userDisplayInfo.nickname }}</span>
      </div>

      <!-- 文本内容 -->
      <p class="post-text">{{ effectivePostData.postNormDto.text }}</p>

      <!-- 媒体文件 -->
      <div class="media-container" v-if="hasMedia" :class="mediaLayoutClass">
        <div 
          v-for="(url, index) in mediaUrls" 
          :key="index"
          class="media-item"
          @click="handleMediaClick(index)"
        >
          <el-image
            :src="url"
            fit="cover"
            loading="lazy"
            :preview-src-list="mediaUrls"
            :initial-index="index"
            :preview-teleported="true"
            :hide-on-click-modal="false"
            :preview-options="{
              zIndex: 3000,
              zoom: true,
              closeOnPressEscape: true,
              initialIndex: index,
              infinite: true,
              maskClosable: true,
              fit: 'contain'
            }"
          />
        </div>
      </div>

      <!-- 时间 -->
      <div class="post-time">
        {{ formatTime(effectivePostData.postNormDto.createTime) }}
      </div>

      <!-- 互动数据 -->
      <div class="post-actions">
        <div class="action-item">
          <el-button 
            class="action-btn like-btn" 
            :class="{ 'is-liked': effectivePostData.postNormDto.liked }"
            text
            @click="handleLike"
          >
            <svg class="like-icon" :class="{ 'liked': effectivePostData.postNormDto.liked }" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M512 919.194002l-64.352657-58.361199C219.085764 653.353378 68.191078 516.438079 68.191078 348.900342c0-136.915299 107.180068-244.094344 244.094344-244.094344 77.222779 0 151.3388 35.948747 199.713554 92.53451 48.374754-56.585763 122.490775-92.53451 199.713554-92.53451 136.915299 0 244.094344 107.180068 244.094344 244.094344 0 167.537737-150.894685 304.453037-379.456265 511.933485L512 919.194002z" />
            </svg>
            <span>{{ formatCount(effectivePostData.postNormDto.likeCount) }}</span>
          </el-button>
        </div>
        <div class="action-item">
          <el-button class="action-btn repost-btn" text>
            <el-icon><RefreshRight /></el-icon>
            <span>{{ formatCount(effectivePostData.postNormDto.repostCount) }}</span>
          </el-button>
        </div>
        <div class="action-item">
          <el-button class="action-btn comment-btn" text>
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ formatCount(effectivePostData.postNormDto.commentCount) }}</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineExpose, ref, watch } from 'vue'
import { ChatDotRound, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElAvatar } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import api from '../api'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

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

// 推文数据接口
interface PostNormDto {
  id: string
  text: string
  url1?: string
  url2?: string
  url3?: string
  url4?: string
  likeCount: number
  commentCount: number
  repostCount: number
  createTime: string
  liked: boolean
  createBy: string
}

interface PostData {
  type: number
  postNormDto: PostNormDto
}

// 接收postId或完整的推文数据
const props = defineProps<{
  postId?: string
  postData?: PostData
}>()

// 本地状态
const localPostData = ref<typeof props.postData | null>(null)
const userInfo = ref<UserInfo | null>(null)

// 计算用户显示信息
const userDisplayInfo = computed(() => ({
  avatarUrl: userInfo.value?.avatarUrl || '',
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

// 获取推文数据
const fetchPostData = async (id: string) => {
  try {
    const response = await api.get(`/post/get/${id}`, {
      transformResponse: [(data) => {
        // 在 JSON.parse 之前处理大数字
        const processedData = data.replace(/"createBy"\s*:\s*(\d{15,})/g, '"createBy":"$1"')
        return JSON.parse(processedData)
      }]
    })
    const { code, data } = response.data
    if (code === '1' && data) {
      localPostData.value = data
      // 获取到推文数据后，立即获取用户信息
      if (data.postNormDto.createBy) {
        fetchUserInfo(data.postNormDto.createBy)
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

// 计算最终使用的数据
const effectivePostData = computed(() => {
  return props.postData || localPostData.value
})

// 处理媒体文件
const mediaUrls = computed(() => {
  if (!effectivePostData.value) return []
  const urls = []
  const { url1, url2, url3, url4 } = effectivePostData.value.postNormDto
  if (url1) urls.push(url1)
  if (url2) urls.push(url2)
  if (url3) urls.push(url3)
  if (url4) urls.push(url4)
  return urls
})

const hasMedia = computed(() => mediaUrls.value.length > 0)

// 根据媒体数量决定布局样式
const mediaLayoutClass = computed(() => {
  const count = mediaUrls.value.length
  return {
    'media-single': count === 1,
    'media-two': count === 2,
    'media-three': count === 3,
    'media-four': count === 4
  }
})

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}

// 格式化数字
const formatCount = (count: number) => {
  if (count < 1000) return count
  if (count < 10000) return (count / 1000).toFixed(1) + 'K'
  return (count / 10000).toFixed(1) + 'W'
}

// 处理点赞
const handleLike = async () => {
  if (!effectivePostData.value) return
  
  // 检查用户是否已登录
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录后再进行点赞')
    return
  }
  
  try {
    const currentPost = effectivePostData.value.postNormDto
    // 直接使用 props.postId 或从 URL 中获取原始 ID，避免精度丢失
    let postId = props.postId
    
    // 如果没有 props.postId，则尝试使用当前数据中的 ID
    if (!postId && currentPost) {
      postId = currentPost.id
      // 如果 ID 看起来已经丢失精度（末尾是 0），则尝试从 URL 获取
      if (postId.toString().endsWith('00')) {
        // 尝试从当前 URL 获取 ID
        const urlMatch = window.location.href.match(/\/(\d{15,})/)
        if (urlMatch && urlMatch[1]) {
          postId = urlMatch[1]
        }
      }
    }
    
    const liked = !currentPost.liked // 切换点赞状态
    
    console.log('发送点赞请求，ID:', postId) // 调试用
    
    // 发送点赞/取消点赞请求
    const response = await api.post('/post/like', 
      // 使用字符串模板构建 JSON，确保 ID 不会被 JavaScript 解析为数字
      JSON.parse(`{"postId":"${postId}","postType":0,"liked":${liked}}`)
    )
    
    const { code, msg } = response.data
    if (code === '1') {
      // 点赞成功后重新获取推文数据
      if (props.postId) {
        fetchPostData(props.postId)
      }
      
      // 显示操作结果
      ElMessage.success(liked ? '点赞成功' : '已取消点赞')
    } else {
      ElMessage.error(msg || '操作失败')
    }
  } catch (error) {
    ElMessage.error('点赞操作失败，请稍后再试')
    console.error('点赞错误:', error)
  }
}

// 处理媒体点击
const handleMediaClick = (index: number) => {
  // 图片预览由 el-image 组件自动处理
}
</script>

<style scoped>
.post {
  padding: 16px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.post:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.post-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-text {
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.media-container {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background-color: #f7f7f7;
  aspect-ratio: 1;
  display: grid;
  gap: 2px;
}

.media-item {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.media-item :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.media-item :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.media-item:hover :deep(img) {
  transform: scale(1.02);
}

/* 单张图片 */
.media-single {
  aspect-ratio: 16/9;
}

/* 两张图片 */
.media-two {
  grid-template-columns: repeat(2, 1fr);
}

/* 三张图片 */
.media-three {
  grid-template-areas: 
    "main right-top"
    "main right-bottom";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.media-three .media-item:first-child {
  grid-area: main;
}

.media-three .media-item:nth-child(2) {
  grid-area: right-top;
}

.media-three .media-item:nth-child(3) {
  grid-area: right-bottom;
}

/* 四张图片 */
.media-four {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.post-time {
  font-size: 14px;
  color: #536471;
}

.post-actions {
  display: flex;
  justify-content: center;
  padding: 4px 0;
  margin-top: 8px;
  gap: 48px;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #536471;
  font-size: 13px;
  padding: 8px;
  border-radius: 50px;
  transition: all 0.2s ease;
  min-width: 70px;
}

.action-btn :deep(.el-icon) {
  font-size: 18px;
  width: 18px;
  height: 18px;
}

/* 评论按钮 */
.comment-btn:hover {
  color: var(--el-color-primary);
  background-color: rgba(29, 155, 240, 0.1);
}

/* 转发按钮 */
.repost-btn:hover {
  color: rgb(0, 186, 124);
  background-color: rgba(0, 186, 124, 0.1);
}

/* 点赞按钮 */
.like-btn:hover {
  color: #ff4757;
}

.like-btn.is-liked {
  color: #ff4757;
}

.like-btn.is-liked:hover {
  background-color: rgba(255, 71, 87, 0.1);
}

/* 数字计数 */
.action-btn span {
  font-size: 13px;
  font-weight: 400;
  min-width: 12px;
}

.like-icon {
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

.like-icon path {
  fill: transparent;
  stroke: currentColor;
  stroke-width: 50;
  transition: all 0.2s ease;
}

.like-icon.liked path {
  fill: currentColor;
  stroke: currentColor;
}

/* 点赞按钮 */
.like-btn:hover {
  color: #ff4757;
}

.like-btn.is-liked {
  color: #ff4757;
}

.like-btn.is-liked:hover {
  background-color: rgba(255, 71, 87, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.user-avatar {
  flex-shrink: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity 0.2s;
}

.user-avatar:hover {
  opacity: 0.8;
}

.user-nickname {
  font-weight: 600;
  font-size: 15px;
  color: #0f1419;
  cursor: pointer;
}

.user-nickname:hover {
  text-decoration: underline;
}
</style> 