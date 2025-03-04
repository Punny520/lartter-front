import api from './index'
import type { AccountDto } from '../types/account'

interface LoginResponse {
  code: string;
  msg: string;
  data: string; // token
}

export const authApi = {
  login: (data: AccountDto) => {
    return api.post<LoginResponse>('/account/login', data)
  }
} 