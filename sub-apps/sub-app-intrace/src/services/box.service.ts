import { ApiClient } from '@superapp/core-services';
import { BoxItem, CreateBoxPayload, IntraceListResponse } from '@superapp/core-contracts';
import { INTRACE_CONFIG } from '../config/env';

/**
 * Service xử lý nghiệp vụ Thùng hàng (Box) - inTrace
 */
export class BoxService {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient(INTRACE_CONFIG.BASE_URL);
  }

  /**
   * Lấy danh sách thùng hàng (phân trang, tìm kiếm)
   */
  async getBoxes(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: number;
  }): Promise<{ boxes: BoxItem[]; total: number }> {
    const query = new URLSearchParams();
    query.append('page', String(params?.page || 1));
    query.append('limit', String(params?.limit || 20));
    query.append('sort[0][key]', 'created_at');
    query.append('sort[0][direction]', 'DESC');

    if (params?.keyword) {
      query.append('code', params.keyword);
    }
    if (params?.status !== undefined) {
      query.append('status', String(params.status));
    }

    const response = await this.api.get<IntraceListResponse<BoxItem>>(
      `${INTRACE_CONFIG.ENDPOINTS.BOXES}?${query.toString()}`
    );

    const boxes = response?.data?.boxes?.boxes || [];
    const total = response?.data?.boxes?.total || boxes.length;

    return { boxes, total };
  }

  /**
   * Lấy chi tiết thông tin một thùng
   */
  async getBoxDetail(boxId: string): Promise<BoxItem> {
    const response = await this.api.get<{ data: BoxItem }>(
      `${INTRACE_CONFIG.ENDPOINTS.BOXES}/${boxId}`
    );
    return response.data;
  }

  /**
   * Lưu đóng thùng mới kèm danh sách mã tem sản phẩm
   */
  async createBox(payload: CreateBoxPayload): Promise<{ success: boolean; data?: BoxItem; message?: string }> {
    const response = await this.api.post<{ status: string; data: BoxItem; message?: string }>(
      INTRACE_CONFIG.ENDPOINTS.BOXES,
      payload
    );

    return {
      success: response?.status === 'success',
      data: response?.data,
      message: response?.message,
    };
  }

  /**
   * Xóa một thùng hàng
   */
  async deleteBox(boxId: string): Promise<boolean> {
    const response = await this.api.delete<{ status: string }>(
      `${INTRACE_CONFIG.ENDPOINTS.BOXES}/${boxId}`
    );
    return response?.status === 'success';
  }
}

export const boxService = new BoxService();
