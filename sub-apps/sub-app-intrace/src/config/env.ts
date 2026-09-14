/**
 * Cấu hình riêng biệt cho Sub-App inTrace
 */

export const INTRACE_CONFIG = {
  BASE_URL: 'https://trace.intrustdss.xyz/api',
  ENDPOINTS: {
    BOXES: '/boxes',
    BOX_AVAILABLE_CODES: '/boxes/available-codes',
    CONTAINERS: '/containers',
  },
  TIMEOUT: 15000,
};
