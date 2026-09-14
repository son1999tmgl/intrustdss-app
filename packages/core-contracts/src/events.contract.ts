/**
 * Hợp đồng sự kiện Event Bus dùng chung giữa các App
 * Đảm bảo Type-safe khi Publish / Subscribe
 */

export interface AppEventPayloads {
  // Sự kiện hệ thống
  'AUTH_LOGIN_SUCCESS': { userId: string; timestamp: number };
  'AUTH_LOGOUT': { reason?: string };
  'NETWORK_STATUS_CHANGED': { isConnected: boolean };

  // Sự kiện từ Sub-app Scanner (Quét mã)
  'SCANNER_BARCODE_DETECTED': {
    code: string;
    format: string;
    scannedAt: number;
  };

  // Sự kiện từ Sub-app Orders (Đơn hàng)
  'ORDER_CREATED': {
    orderId: string;
    totalAmount: number;
    itemCount: number;
  };

  // Sự kiện từ Sub-app Chat
  'CHAT_NEW_MESSAGE_RECEIVED': {
    senderId: string;
    snippet: string;
  };
}

export type AppEventName = keyof AppEventPayloads;
