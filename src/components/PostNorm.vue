<template>
  <div class="post">
    <div class="post-content">
      <!-- 文本内容 -->
      <p class="post-text">{{ postData.postNormDto.text }}</p>

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
        {{ formatTime(postData.postNormDto.createTime) }}
      </div>

      <!-- 互动数据 -->
      <div class="post-actions">
        <div class="action-item">
          <el-button 
            class="action-btn like-btn" 
            :class="{ 'is-liked': postData.postNormDto.liked }"
            text
            @click="handleLike"
          >
            <svg class="like-icon" :class="{ 'liked': postData.postNormDto.liked }" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M512 919.194002l-64.352657-58.361199C219.085764 653.353378 68.191078 516.438079 68.191078 348.900342c0-136.915299 107.180068-244.094344 244.094344-244.094344 77.222779 0 151.3388 35.948747 199.713554 92.53451 48.374754-56.585763 122.490775-92.53451 199.713554-92.53451 136.915299 0 244.094344 107.180068 244.094344 244.094344 0 167.537737-150.894685 304.453037-379.456265 511.933485L512 919.194002z" />
            </svg>
            <span>{{ formatCount(postData.postNormDto.likeCount) }}</span>
          </el-button>
        </div>
        <div class="action-item">
          <el-button class="action-btn repost-btn" text>
            <el-icon><RefreshRight /></el-icon>
            <span>{{ formatCount(postData.postNormDto.repostCount) }}</span>
          </el-button>
        </div>
        <div class="action-item">
          <el-button class="action-btn comment-btn" text>
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ formatCount(postData.postNormDto.commentCount) }}</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineExpose, defineOptions } from 'vue'
import { ChatDotRound, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 组件名称定义
defineOptions({
  name: 'PostNorm'
})

// 接收完整的推文数据
const props = defineProps<{
  postData: {
    type: number
    postNormDto: {
      id: number
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
    }
  }
}>()

// 处理媒体文件
const mediaUrls = computed(() => {
  const urls = []
  const { url1, url2, url3, url4 } = props.postData.postNormDto
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
  // TODO: 实现点赞功能
  ElMessage.info('点赞功能开发中...')
}

// 处理媒体点击
const handleMediaClick = (index: number) => {
  // 图片预览由 el-image 组件自动处理
}

// 导出组件
defineExpose({
  handleLike,
  handleMediaClick
})
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
</style> 