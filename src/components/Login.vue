<template>
  <div class="login-overlay" :class="{ 'show': show }" @click.self="$emit('close')">
    <div class="login-container" :class="{ 'slide-in': show }">
      <!-- 头部 -->
      <div class="login-header">
        <el-button class="back-button" @click="$emit('close')" text>
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="logo">
          <el-icon><ChatDotRound /></el-icon>
        </div>
      </div>

      <!-- 主体内容 -->
      <div class="login-content">
        <h2>登录 Lartter</h2>
        
        <!-- 登录方式切换 -->
        <div class="login-type">
          <el-radio-group v-model="loginType">
            <el-radio-button label="password">密码登录</el-radio-button>
            <el-radio-button label="code">验证码登录</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 登录表单 -->
        <el-form 
          class="login-form" 
          :model="formData"
          :rules="rules"
          ref="loginFormRef"
        >
          <!-- 账号输入框 -->
          <el-form-item>
            <div class="input-group">
              <el-form-item prop="account">
                <el-input 
                  v-model="formData.account"
                  :placeholder="getPlaceholder"
                />
              </el-form-item>
              <el-select v-model="accountType" class="prefix-select">
                <el-option label="账号" value="account" v-if="loginType === 'password'" />
                <el-option label="手机" value="phone" />
                <el-option label="邮箱" value="email" />
              </el-select>
            </div>
          </el-form-item>

          <!-- 密码登录 -->
          <el-form-item prop="password" v-if="loginType === 'password'">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>

          <!-- 验证码登录 -->
          <el-form-item prop="verifyCode" v-else>
            <div class="verify-group">
              <el-input
                v-model="formData.verifyCode"
                placeholder="请输入验证码"
              />
              <el-button 
                type="primary" 
                :disabled="isGettingCode"
                @click="handleGetCode"
              >
                {{ codeButtonText }}
              </el-button>
            </div>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              class="submit-button" 
              @click="handleLogin"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 第三方登录 -->
        <div class="divider">
          <span class="line"></span>
          <span class="text">其他登录方式</span>
          <span class="line"></span>
        </div>

        <div class="social-login">
          <el-button class="social-btn" type="default" @click="handleGoogleLogin">
            <img
              src="https://developers.google.cn/identity/images/g-logo.png"
              alt="Google"
              class="google-icon"
            >
            <span>使用 Google 账号登录</span>
            <div></div>
          </el-button>

          <el-button class="social-btn wechat-btn" type="success" @click="handleWeChatLogin">
            <img
              src="../assets/icon/wechat.svg"
              alt="WeChat"
              class="wechat-icon"
            >
            <span>使用微信账号登录</span>
            <div></div>
          </el-button>
        </div>

        <!-- 底部链接 -->
        <div class="login-footer">
          <el-link>忘记密码？</el-link>
          <el-link>注册账号</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// 登录方式
const loginType = ref<'password' | 'code'>('password')

// 账号类型
const accountType = ref<'account' | 'phone' | 'email'>('account')

// 表单数据
const formData = ref({
  account: '',
  password: '',
  verifyCode: ''
})

// 表单校验规则
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ]
}

const loading = ref(false)
const loginFormRef = ref<FormInstance>()

// 获取验证码相关
const isGettingCode = ref(false)
const countdown = ref(60)
const codeButtonText = computed(() => {
  return isGettingCode.value ? `${countdown.value}s` : '获取验证码'
})

// 输入框提示文本
const getPlaceholder = computed(() => {
  const map = {
    account: '请输入账号',
    phone: '请输入手机号',
    email: '请输入邮箱'
  }
  return map[accountType.value]
})

// 获取验证码
const handleGetCode = () => {
  if (!formData.value.account) {
    ElMessage.warning('请输入手机号或邮箱')
    return
  }
  
  isGettingCode.value = true
  countdown.value = 60
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isGettingCode.value = false
    }
  }, 1000)
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    // TODO: 实现登录逻辑
    ElMessage.success('登录成功')
    emit('close')
  } catch (error) {
    console.error('登录验证失败:', error)
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = () => {
  ElMessage.info('Google登录功能正在开发中...')
}

const handleWeChatLogin = () => {
  ElMessage.info('微信登录功能正在开发中...')
}
</script>

<style scoped>
.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  padding: 20px;
  z-index: 2000;
}

.login-overlay.show {
  opacity: 1;
  visibility: visible;
}

.login-container {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s;
}

.login-container.slide-in {
  transform: translateY(0);
  opacity: 1;
}

.login-header {
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
}

.back-button {
  position: absolute;
  left: 16px;
  padding: 8px;
  font-size: 18px;
  border-radius: 50%;
  color: #666;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.04);
}

.logo {
  font-size: 24px;
  color: #1DA1F2;
}

.login-content {
  padding: 32px 40px;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
}

h2 {
  margin: 0 0 32px;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  color: #1c1e21;
}

.login-type {
  margin-bottom: 24px;
}

:deep(.el-radio-group) {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

:deep(.el-radio-button__inner) {
  width: 100%;
  height: 44px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #f3f4f6;
  color: #1DA1F2;
  border-color: #1DA1F2;
  box-shadow: none;
}

:deep(.el-radio-button:not(:last-child)) {
  margin-right: 0;
}

.login-form {
  margin-top: 24px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: none !important;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #1DA1F2;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #1DA1F2;
  box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.2) !important;
}

:deep(.el-input__inner) {
  height: 100%;
  color: #1c1e21;
  font-size: 15px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.input-group {
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 12px;
  width: 100%;
}

.input-group :deep(.el-form-item) {
  margin-bottom: 0;
}

.input-group :deep(.el-form-item__content) {
  margin: 0;
}

.prefix-select {
  width: 100%;
  order: 2;
}

:deep(.prefix-select .el-input__wrapper) {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  height: 44px;
  box-shadow: none !important;
  background-color: #fff;
  padding: 0 16px;
}

:deep(.prefix-select .el-input__wrapper:hover) {
  border-color: #1DA1F2;
}

:deep(.prefix-select .el-input__wrapper.is-focus) {
  border-color: #1DA1F2;
  box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.2) !important;
}

:deep(.prefix-select .el-select__wrapper) {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.prefix-select .el-select__selection) {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

:deep(.prefix-select .el-input__inner) {
  color: #1c1e21;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
}

:deep(.prefix-select .el-select__caret) {
  color: #666;
  font-size: 16px;
  transition: transform 0.3s;
  margin: 0 -4px 0 4px;
}

:deep(.prefix-select .el-select__caret.is-reverse) {
  transform: rotate(-180deg);
}

:deep(.el-select-dropdown.el-popper) {
  border-radius: 12px;
  padding: 8px;
  margin-top: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

:deep(.el-select-dropdown__list) {
  padding: 0;
}

:deep(.el-select-dropdown__item) {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  font-size: 15px;
  color: #666;
  border-radius: 8px;
}

:deep(.el-select-dropdown__item.selected) {
  color: #1DA1F2;
  font-weight: 500;
  background-color: #f0f7ff;
}

:deep(.el-select-dropdown__item:hover:not(.selected)) {
  background-color: #f8f9fa;
}

:deep(.el-popper__arrow) {
  display: none !important;
}

.verify-group {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
}

.verify-group .el-button {
  width: 130px;
  height: 44px;
  border-radius: 8px;
  margin: 0;
  font-size: 15px;
  font-weight: bold;
}

.submit-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  margin-top: 4px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(29, 161, 242, 0.2);
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.line {
  flex: 1;
  height: 1px;
  background-color: #eee;
}

.text {
  padding: 0 16px;
  color: #536471;
  font-size: 14px;
}

.social-login {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.social-btn {
  width: 100%;
  height: 44px;
  display: grid;
  grid-template-columns: 28px 1fr 28px;
  align-items: center;
  border-radius: 22px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  padding: 0 20px;
  margin: 0 !important;
}

.social-btn:hover {
  transform: translateY(-1px);
}

.social-btn img {
  width: 22px;
  height: 22px;
}

.social-btn span {
  text-align: center;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.wechat-btn {
  --el-button-bg-color: #07C160;
  --el-button-border-color: #07C160;
  --el-button-hover-bg-color: #06ae56;
  --el-button-hover-border-color: #06ae56;
  --el-button-active-bg-color: #06ae56;
  --el-button-active-border-color: #06ae56;
}

.social-btn.wechat-btn:hover {
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.2);
}

.social-btn:not(.wechat-btn):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.wechat-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.login-footer {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

:deep(.el-link) {
  font-size: 14px;
  color: #1DA1F2;
}

:deep(.el-link:hover) {
  color: #1a91da;
}
</style> 