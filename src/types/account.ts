// 登录类型枚举
export enum LoginType {
  ACCOUNT_PASSWORD = 'ACCOUNT_PASSWORD', // 账号-密码登录
  PHONE_PASSWORD = 'PHONE_PASSWORD',     // 手机号-密码登录
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',     // 邮箱-密码登录
  PHONE_VERIFY_CODE = 'PHONE_VERIFY_CODE', // 手机验证码登录
  EMAIL_VERIFY_CODE = 'EMAIL_VERIFY_CODE'  // 邮箱验证码登录
}

// 注册类型枚举
export enum RegisterType {
  EMAIL_VERIFY_CODE = 'EMAIL_VERIFY_CODE', // 邮箱验证码注册
  PHONE_VERIFY_CODE = 'PHONE_VERIFY_CODE'  // 手机验证码注册
}

// 验证码类型枚举
export enum VerifyCodeType {
  PHONE = 'PHONE', // 手机验证码
  EMAIL = 'EMAIL'  // 邮箱验证码
}

// 更新类型枚举
export enum UpdateType {
  PASSWORD = 'PASSWORD'
}

// 绑定类型枚举
export enum BindType {
  PHONE = 'PHONE', // 手机绑定相关操作
  EMAIL = 'EMAIL'  // 邮箱绑定相关操作
}

// AccountDto 接口
export interface AccountDto {
  account?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  email?: string;
  verifyCode?: string;
  loginType?: LoginType;
  registerType?: RegisterType;
  verifyCodeType?: VerifyCodeType;
  oldPassword?: string;
  newPassword?: string;
  bindType?: BindType;
  updateType?: UpdateType;
} 