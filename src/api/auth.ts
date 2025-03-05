import api from './index'
import type { AccountDto } from '../types/account'
import type { VerifyCodeType } from '../types/account'

interface LoginResponse {
  code: string;
  msg: string;
  data: string; // token
}

interface VerifyCodeResponse {
  code: string;
  msg: string;
}

interface GetVerifyCodeRequest {
  phone?: string;
  email?: string;
  verifyCodeType: VerifyCodeType;
}

export const authApi = {
  login: (data: AccountDto) => {
    return api.post<LoginResponse>('/account/login', data)
  },
  logout: () => {
    return api.get<LoginResponse>('/account/logout')
  },
  getVerifyCode: (data: GetVerifyCodeRequest) => {
    return api.post<VerifyCodeResponse>('/account/get_verify_code', data)
  },
  register: (data: AccountDto) => {
    return api.post<LoginResponse>('/account/register', data)
  }
} 