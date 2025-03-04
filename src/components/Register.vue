<template>
  <div class="register-overlay" :class="{ 'show': show }" @click.self="$emit('close')">
    <div class="register-slide" :class="{ 'slide-in': show }">
      <div class="register-header">
        <el-button class="back-btn" @click="$emit('close')" type="text">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <el-icon class="logo-small"><ChatDotRound /></el-icon>
      </div>

      <div class="register-form-container">
        <h2>创建你的账号</h2>
        <el-form class="register-form" :model="registerForm">
          <el-form-item>
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="registerForm.email"
              placeholder="电子邮箱"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              show-password
            />
          </el-form-item>

          <div class="birth-date">
            <h3>出生日期</h3>
            <p class="hint">此信息不会公开显示。请确认你自己的年龄。</p>
            <el-date-picker
              v-model="registerForm.birthDate"
              type="date"
              placeholder="选择日期"
              format="YYYY/MM/DD"
              size="large"
              style="width: 100%"
            />
          </div>

          <el-button type="primary" class="register-btn" size="large">
            注册
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChatDotRound, ArrowLeft } from '@element-plus/icons-vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: ''
})
</script>

<style scoped>
.register-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.register-overlay.show {
  opacity: 1;
  visibility: visible;
}

.register-slide {
  position: relative;
  width: 600px;
  min-height: 650px;
  background-color: #fff;
  border-radius: 16px;
  transform: translateY(50px);
  opacity: 0;
  transition: all 0.3s ease;
}

.register-slide.slide-in {
  transform: translateY(0);
  opacity: 1;
}

.register-header {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  font-size: 20px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.back-btn:hover {
  background-color: rgba(15, 20, 25, 0.1);
}

.logo-small {
  font-size: 32px;
  color: #1DA1F2;
}

.register-form-container {
  max-width: 364px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  font-size: 31px;
  font-weight: bold;
  margin: 48px 0 32px;
  color: #0F1419;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.birth-date {
  margin: 16px 0;
}

.birth-date h3 {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #0F1419;
}

.hint {
  font-size: 13px;
  color: #536471;
  margin-bottom: 12px;
}

.register-btn {
  width: 100%;
  background-color: #1DA1F2;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  height: 44px;
  margin-top: 16px;
}

.register-btn:hover {
  background-color: #1a91da;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-date-editor) {
  --el-datepicker-border-color: #cfd9e0;
}
</style> 