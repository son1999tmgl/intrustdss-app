/**
 * Hợp đồng dữ liệu nghiệp vụ inTrace (Đóng thùng & Đóng công)
 */

export interface ProductStampItem {
  id?: string;
  code: string;
  serial?: string;
  productName?: string;
  scannedAt: string;
}

export interface BoxItem {
  id: string;
  code: string;
  status: number; // 1: Khởi tạo, 2: Đã lưu, 3: Đã xuất
  store_status: number; // 0: Bình thường, 1: Lưu lỗi
  total_products?: number;
  product_category_name?: string;
  created_at: string;
  updated_at?: string;
  products?: ProductStampItem[];
}

export interface ContainerItem {
  id: string;
  code: string;
  status: number;
  total_boxes?: number;
  created_at: string;
  updated_at?: string;
  boxes?: BoxItem[];
}

export interface CreateBoxPayload {
  code: string;
  product_codes: string[];
  product_category_id?: string;
}

export interface CreateContainerPayload {
  code: string;
  box_codes: string[];
}

export interface IntraceListResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: {
    total?: number;
    boxes?: {
      boxes: T[];
      total: number;
    };
    containers?: {
      containers: T[];
      total: number;
    };
  };
}
