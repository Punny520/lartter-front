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
        <el-form 
          class="register-form" 
          :model="registerForm"
          :rules="rules"
          ref="registerFormRef"
        >
          <el-form-item prop="account">
            <el-input
              v-model="registerForm.account"
              placeholder="用户名"
              size="large"
            />
          </el-form-item>

          <!-- 账号类型和输入框组 -->
          <el-form-item>
            <div class="input-group">
              <el-form-item prop="contact">
                <el-input
                  v-model="registerForm.contact"
                  :placeholder="contactPlaceholder"
                  size="large"
                />
              </el-form-item>
              <el-select v-model="contactType" class="prefix-select">
                <el-option label="手机" value="phone" />
                <el-option label="邮箱" value="email" />
              </el-select>
            </div>
          </el-form-item>

          <!-- 验证码输入框 -->
          <el-form-item prop="verifyCode">
            <div class="verify-group">
              <el-input
                v-model="registerForm.verifyCode"
                placeholder="请输入验证码"
                size="large"
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

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              show-password
            />
          </el-form-item>

          <el-button 
            type="primary" 
            class="register-btn" 
            size="large"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChatDotRound, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { authApi } from '../api/auth'
import { RegisterType, VerifyCodeType } from '../types/account'
import { useRouter } from 'vue-router'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()

// 账号类型
const contactType = ref<'phone' | 'email'>('phone')

// 表单数据
const registerForm = ref({
  account: '',
  contact: '',
  password: '',
  confirmPassword: '',
  verifyCode: ''
})

// 表单校验规则
const rules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, message: '用户名长度不能小于4位', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (contactType.value === 'phone') {
          const phoneReg = /^1[3-9]\d{9}$/
          if (!phoneReg.test(value)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        } else {
          const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
          if (!emailReg.test(value)) {
            callback(new Error('请输入正确的邮箱'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度应为4位', trigger: 'blur' },
    { pattern: /^\d{4}$/, message: '验证码必须是4位数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const loading = ref(false)
const registerFormRef = ref<FormInstance>()

// 获取验证码相关
const isGettingCode = ref(false)
const countdown = ref(60)
const codeButtonText = computed(() => {
  return isGettingCode.value ? `${countdown.value}s` : '获取验证码'
})

// 输入框提示文本
const contactPlaceholder = computed(() => {
  return contactType.value === 'phone' ? '请输入手机号' : '请输入邮箱'
})

// 获取验证码
const handleGetCode = async () => {
  if (!registerForm.value.contact) {
    ElMessage.warning('请输入手机号或邮箱')
    return
  }

  try {
    isGettingCode.value = true
    const requestData = {
      verifyCodeType: contactType.value === 'phone' ? VerifyCodeType.PHONE : VerifyCodeType.EMAIL
    } as const

    // 根据账号类型设置请求参数
    if (contactType.value === 'phone') {
      requestData.phone = registerForm.value.contact
    } else {
      requestData.email = registerForm.value.contact
    }

    const response = await authApi.getVerifyCode(requestData)
    const { code, msg } = response.data

    if (code === '1') {
      ElMessage.success('验证码已发送')
      // 开始倒计时
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          isGettingCode.value = false
        }
      }, 1000)
    } else {
      ElMessage.error(msg || '验证码获取失败')
      isGettingCode.value = false
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
    ElMessage.error('验证码获取失败')
    isGettingCode.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    loading.value = true

    const registerData = {
      account: registerForm.value.account,
      password: registerForm.value.password,
      verifyCode: registerForm.value.verifyCode,
      registerType: contactType.value === 'phone' ? RegisterType.PHONE_VERIFY_CODE : RegisterType.EMAIL_VERIFY_CODE,
      verifyCodeType: contactType.value === 'phone' ? VerifyCodeType.PHONE : VerifyCodeType.EMAIL
    }

    // 根据联系方式类型添加对应字段
    if (contactType.value === 'phone') {
      registerData.phone = registerForm.value.contact
    } else {
      registerData.email = registerForm.value.contact
    }

    const response = await authApi.register(registerData)
    const { code, msg, data: token } = response.data

    if (code === '1') {
      ElMessage.success('注册成功')
      // 保存token并跳转到首页
      localStorage.setItem('token', token)
      emit('close')
      router.push('/home')
    } else {
      ElMessage.error(msg || '注册失败')
    }
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请检查输入')
  } finally {
    loading.value = false
  }
}
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

.input-group {
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 12px;
  width: 100%;
}

.input-group :deep(.el-form-item) {
  margin-bottom: 0;
}

.prefix-select {
  width: 100%;
}

:deep(.prefix-select .el-input__wrapper) {
  height: 40px;
}

.verify-group {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
}

.verify-group .el-button {
  width: 130px;
  height: 40px;
  border-radius: 8px;
  margin: 0;
  font-size: 15px;
  font-weight: bold;
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
  border-radius: 8px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-date-editor) {
  --el-datepicker-border-color: #cfd9e0;
}
</style> 