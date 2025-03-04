<template>
  <div class="main-container">
    <!-- 左侧区域 -->
    <div class="left-section">
      <el-icon class="logo-icon"><ChatDotRound /></el-icon>
    </div>

    <!-- 右侧登录区域 -->
    <div class="right-section">
      <div class="login-content">
        <el-icon class="logo-small"><ChatDotRound /></el-icon>
        <h1>正在发生</h1>
        <h2>现在就加入 Lartter</h2>
        
        <div class="login-options">
          <!-- 第三方登录按钮 -->
          <el-button class="social-btn" type="default" @click="showDevelopingMessage">
            <img src="https://developers.google.cn/identity/images/g-logo.png" 
                 alt="Google" 
                 class="google-icon">
            使用 Google 账号注册
          </el-button>
          
          <el-button class="social-btn wechat-btn" type="success" @click="showDevelopingMessage">
            <img src="../assets/icon/wechat.svg" 
                 alt="WeChat" 
                 class="wechat-icon">
            使用微信账号注册
          </el-button>

          <!-- 分割线 -->
          <div class="divider">
            <span class="line"></span>
            <span class="text">或</span>
            <span class="line"></span>
          </div>

          <!-- 创建账号按钮 -->
          <el-button type="primary" class="create-account-btn" @click="showRegister = true">
            创建账号
          </el-button>

          <!-- 注册协议 -->
          <p class="terms">
            注册即表示同意
            <el-link type="primary">服务条款</el-link>和
            <el-link type="primary">隐私政策</el-link>，
            包括<el-link type="primary">Cookie 使用条款</el-link>。
          </p>

          <!-- 已有账号 -->
          <div class="existing-account">
            <h3>已有账号？</h3>
            <el-button type="default" class="signin-btn" @click="showLogin = true">
              登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 登录组件 -->
    <Login :show="showLogin" @close="showLogin = false" />
    
    <!-- 注册组件 -->
    <Register :show="showRegister" @close="showRegister = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

const showLogin = ref(false)
const showRegister = ref(false)

const showDevelopingMessage = () => {
  ElMessage({
    message: '功能正在开发中...',
    type: 'info',
    duration: 2000
  })
}
</script>

<style scoped>
.main-container {
  display: flex;
  min-height: 100vh;
  background-color: #fff;
  position: relative;
}

.left-section {
  flex: 1;
  background-color: #1DA1F2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.logo-icon {
  font-size: 400px;
  color: #fff;
}

.right-section {
  width: 45%;
  padding: 32px;
  display: flex;
  align-items: center;
}

.login-content {
  width: 100%;
  max-width: 364px;
  margin: 0 auto;
}

.logo-small {
  font-size: 40px;
  color: #1DA1F2;
  margin-bottom: 48px;
}

h1 {
  font-size: 64px;
  font-weight: bold;
  margin-bottom: 32px;
  color: #0F1419;
  line-height: 1.2;
}

h2 {
  font-size: 31px;
  font-weight: bold;
  margin-bottom: 32px;
  color: #0F1419;
}

.login-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.social-btn {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  font-weight: bold;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.wechat-btn {
  --el-button-bg-color: #07C160;
  --el-button-border-color: #07C160;
  --el-button-hover-bg-color: #06ae56;
  --el-button-hover-border-color: #06ae56;
  --el-button-active-bg-color: #06ae56;
  --el-button-active-border-color: #06ae56;
}

.wechat-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1); /* 将图标转为白色 */
}

.google-icon {
  width: 18px;
  height: 18px;
}

.divider {
  display: flex;
  align-items: center;
  width: 300px;
}

.line {
  flex: 1;
  height: 1px;
  background-color: #eee;
}

.text {
  padding: 0 12px;
  color: #536471;
  font-size: 14px;
}

.create-account-btn {
  width: 300px;
  background-color: #1DA1F2;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  height: 40px;
}

.create-account-btn:hover {
  background-color: #1a91da;
}

.terms {
  font-size: 13px;
  color: #536471;
  width: 300px;
  line-height: 1.5;
}

.existing-account {
  margin-top: 40px;
}

h3 {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #0F1419;
}

.signin-btn {
  width: 300px;
  border-radius: 20px;
  font-weight: bold;
  height: 40px;
  color: #1DA1F2;
  border-color: #1DA1F2;
}

.signin-btn:hover {
  background-color: rgba(29, 161, 242, 0.1);
}

:deep(.el-link) {
  font-size: 13px;
}

:deep(.el-button) {
  font-weight: bold;
}
</style> 