<template>
  <div class="upload-dialog">
    <div class="upload-header">
      <el-button class="back-btn" text @click="$emit('close')">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <el-button 
        class="post-btn" 
        type="primary" 
        :disabled="!isValid || uploading" 
        :loading="uploading"
        @click="handleSubmit"
      >
        发布
      </el-button>
    </div>

    <div class="upload-content">
      <div class="user-avatar">
        <el-avatar :size="48" :src="userAvatar" />
      </div>
      
      <div class="post-form">
        <el-input
          v-model="postText"
          type="textarea"
          :rows="5"
          placeholder="有什么新鲜事？"
          resize="none"
          maxlength="400"
          show-word-limit
          class="post-textarea"
        />
        
        <div class="media-preview" v-if="previewImages.length > 0">
          <div 
            v-for="(image, index) in previewImages" 
            :key="index"
            class="preview-item"
            :class="mediaLayoutClass"
          >
            <img :src="image.url" alt="预览图片" />
            <div class="remove-btn" @click="removeImage(index)">
              <el-icon><Close /></el-icon>
            </div>
          </div>
        </div>
        
        <div class="upload-actions">
          <el-upload
            ref="uploadRef"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            :multiple="true"
            :limit="4"
            :accept="'image/jpeg,image/png,image/gif'"
          >
            <el-button class="action-btn" text>
              <el-icon><Picture /></el-icon>
            </el-button>
          </el-upload>
          
          <div class="text-counter" :class="{ 'text-warning': postText.length > 380 }">
            {{ postText.length }}/400
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { ArrowLeft, Picture, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadInstance, UploadFile } from 'element-plus'
import api from '../api'

// 定义事件
const emit = defineEmits(['close', 'success'])

// 状态
const postText = ref('')
const previewImages = ref<Array<{file: File, url: string}>>([])
const uploading = ref(false)
const uploadRef = ref<UploadInstance>()

// 用户头像
const userAvatar = ref('')

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    
    // 这里可以添加获取当前用户信息的逻辑
    // 暂时使用默认头像
    userAvatar.value = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

// 初始化
fetchUserInfo()

// 验证表单
const isValid = computed(() => {
  return postText.value.trim().length > 0 && postText.value.length <= 400
})

// 根据媒体数量决定布局样式
const mediaLayoutClass = computed(() => {
  const count = previewImages.value.length
  return {
    'preview-single': count === 1,
    'preview-two': count === 2,
    'preview-three': count === 3,
    'preview-four': count === 4
  }
})

// 处理文件变化
const handleFileChange = (uploadFile: UploadFile) => {
  if (previewImages.value.length >= 4) {
    ElMessage.warning('最多只能上传4张图片')
    return
  }
  
  const file = uploadFile.raw
  if (!file) return
  
  // 验证文件类型
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    ElMessage.error('只能上传JPG/PNG/GIF格式的图片')
    return
  }
  
  // 验证文件大小
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过5MB')
    return
  }
  
  // 创建预览
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      previewImages.value.push({
        file,
        url: e.target.result as string
      })
    }
  }
  reader.readAsDataURL(file)
}

// 移除图片
const removeImage = (index: number) => {
  previewImages.value.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!isValid.value) return
  
  uploading.value = true
  try {
    // 创建FormData
    const formData = new FormData()
    formData.append('text', postText.value)
    
    // 添加图片
    previewImages.value.forEach((item, index) => {
      formData.append(`file${index + 1}`, item.file)
    })
    
    // 发送请求
    const response = await api.post('/post/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    const { code, msg } = response.data
    if (code === '1') {
      ElMessage.success('发布成功')
      emit('success')
      emit('close')
    } else {
      ElMessage.error(msg || '发布失败')
    }
  } catch (error) {
    ElMessage.error('发布失败，请稍后再试')
    console.error('发布错误:', error)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.upload-dialog {
  background-color: #fff;
  border-radius: 16px;
  width: 600px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  font-size: 20px;
  color: #000;
}

.post-btn {
  border-radius: 24px;
  font-weight: bold;
  padding: 8px 16px;
  background-color: #1DA1F2;
  border: none;
}

.post-btn:hover:not(:disabled) {
  background-color: #1a91da;
}

.upload-content {
  display: flex;
  padding: 16px;
  gap: 12px;
  overflow-y: auto;
}

.user-avatar {
  flex-shrink: 0;
}

.post-form {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-textarea {
  border: none;
  padding: 0;
  font-size: 18px;
}

.post-textarea :deep(.el-textarea__inner) {
  border: none;
  padding: 0;
  font-size: 18px;
  box-shadow: none;
}

.post-textarea :deep(.el-input__count) {
  background: transparent;
}

.media-preview {
  display: grid;
  gap: 8px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #f7f7f7;
  aspect-ratio: 1;
}

.preview-item {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

/* 单张图片 */
.preview-single {
  aspect-ratio: 16/9;
}

/* 两张图片 */
.media-preview:has(.preview-two) {
  grid-template-columns: repeat(2, 1fr);
}

/* 三张图片 */
.media-preview:has(.preview-three) {
  grid-template-areas: 
    "main right-top"
    "main right-bottom";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.media-preview:has(.preview-three) .preview-item:nth-child(1) {
  grid-area: main;
}

.media-preview:has(.preview-three) .preview-item:nth-child(2) {
  grid-area: right-top;
}

.media-preview:has(.preview-three) .preview-item:nth-child(3) {
  grid-area: right-bottom;
}

/* 四张图片 */
.media-preview:has(.preview-four) {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.upload-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.action-btn {
  color: #1DA1F2;
  font-size: 20px;
}

.text-counter {
  font-size: 14px;
  color: #536471;
}

.text-warning {
  color: #ff9800;
}
</style> 