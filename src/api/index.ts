import axios from 'axios'
import type { AccountDto } from '../types/account'

// 创建响应数据的接口
interface ApiResponse<T = any> {
  code: string;
  msg: string;
  data: T;
}

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器：处理 token
api.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse
    if (res.code === '1' && res.data) {
      // 如果是登录接口，保存 token
      if (response.config.url === '/account/login') {
        localStorage.setItem('token', res.data)
      }
    }
    return response
  }
)

// 请求拦截器：添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  }
)

export default api
