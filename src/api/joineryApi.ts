import { apiClient } from './client';

export type BatchStatus = 'Pending' | 'Generating' | 'Ready' | 'Failed';

export interface BatchResponse {
  id: string;
  status: BatchStatus;
}

export const joineryApi = {
  createBatch: async (orderIds: string[]): Promise<BatchResponse> => {
    const res = await apiClient.post<BatchResponse>('/joinery/gyartasilap/batch', { orderIds });
    return res.data;
  },

  getBatchStatus: async (batchId: string): Promise<BatchResponse> => {
    const res = await apiClient.get<BatchResponse>(`/joinery/gyartasilap/batch/${batchId}`);
    return res.data;
  },

  downloadBatch: (batchId: string): void => {
    window.open(`/bff/joinery/gyartasilap/batch/${batchId}/download`);
  },

  downloadAnyaglista: async (orderIds: string[]): Promise<Blob> => {
    const res = await apiClient.post('/joinery/anyaglista', { orderIds }, { responseType: 'blob' });
    return res.data as Blob;
  },
};
