import { ApiClient } from '@superapp/core-services';
import { ContainerItem, CreateContainerPayload, IntraceListResponse } from '@superapp/core-contracts';
import { INTRACE_CONFIG } from '../config/env';

/**
 * Service xử lý nghiệp vụ Công vận chuyển (Container) - inTrace
 */
export class ContainerService {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient(INTRACE_CONFIG.BASE_URL);
  }

  /**
   * Lấy danh sách công vận chuyển
   */
  async getContainers(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: number;
  }): Promise<{ containers: ContainerItem[]; total: number }> {
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

    const response = await this.api.get<IntraceListResponse<ContainerItem>>(
      `${INTRACE_CONFIG.ENDPOINTS.CONTAINERS}?${query.toString()}`
    );

    const containers = response?.data?.containers?.containers || [];
    const total = response?.data?.containers?.total || containers.length;

    return { containers, total };
  }

  /**
   * Lấy chi tiết công
   */
  async getContainerDetail(containerId: string): Promise<ContainerItem> {
    const response = await this.api.get<{ data: ContainerItem }>(
      `${INTRACE_CONFIG.ENDPOINTS.CONTAINERS}/${containerId}`
    );
    return response.data;
  }

  /**
   * Tạo đóng công mới chứa danh sách mã thùng
   */
  async createContainer(payload: CreateContainerPayload): Promise<{ success: boolean; data?: ContainerItem; message?: string }> {
    const response = await this.api.post<{ status: string; data: ContainerItem; message?: string }>(
      INTRACE_CONFIG.ENDPOINTS.CONTAINERS,
      payload
    );

    return {
      success: response?.status === 'success',
      data: response?.data,
      message: response?.message,
    };
  }

  /**
   * Xóa công
   */
  async deleteContainer(containerId: string): Promise<boolean> {
    const response = await this.api.delete<{ status: string }>(
      `${INTRACE_CONFIG.ENDPOINTS.CONTAINERS}/${containerId}`
    );
    return response?.status === 'success';
  }
}

export const containerService = new ContainerService();
