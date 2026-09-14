/**
 * Cấu hình môi trường cho Host App (App Tổng)
 * ĐÃ TÁCH BIỆT: Sau này App Tổng đổi sang Domain / SSO riêng thì chỉ cần đổi file này!
 */

export const AUTH_CONFIG = {
  // Hiện tại dùng tạm backend Intrace theo yêu cầu
  BASE_URL: 'https://trace.intrustdss.xyz/api',
  ENDPOINTS: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    PROFILE: '/users/profile',
    REFRESH_TOKEN: '/login/refresh',
  },
  TIMEOUT: 15000,
};

export const APP_INFO = {
  NAME: 'Super App',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'vi',
};
