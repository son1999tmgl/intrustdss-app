/**
 * Danh mục URL Scheme chuẩn hóa cho 5 Sub-apps trong Super App
 * Định dạng: superapp://<sub-app-name>/<screen-path>
 */

export const APP_ROUTES = {
  HOST: {
    HOME: 'superapp://host/home',
    LOGIN: 'superapp://host/login',
    SETTINGS: 'superapp://host/settings',
  },
  ECONTRACT: {
    ROOT: 'superapp://econtract',
    LIST: 'superapp://econtract/list',
  },
  EBHXH: {
    ROOT: 'superapp://ebhxh',
    LIST: 'superapp://ebhxh/list',
  },
  HOADON: {
    ROOT: 'superapp://hoadon',
    LIST: 'superapp://hoadon/list',
  },
  INTRACE: {
    ROOT: 'superapp://intrace',
    BOX_LIST: 'superapp://intrace/boxes',
    BOX_SCAN: 'superapp://intrace/boxes/scan',
    CONTAINER_LIST: 'superapp://intrace/containers',
    CONTAINER_SCAN: 'superapp://intrace/containers/scan',
  },
  INFARM: {
    ROOT: 'superapp://infarm',
    LIST: 'superapp://infarm/list',
  },
} as const;

export type AppRoute = typeof APP_ROUTES;
