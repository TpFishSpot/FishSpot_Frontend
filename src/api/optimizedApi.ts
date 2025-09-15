import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000,
});

export interface DashboardData {
  spots: any[];
  especies: any[];
  tiposPesca: any[];
  timestamp: string;
}

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    const [spotsRes, especiesRes, tiposPescaRes] = await Promise.all([
      api.get('/spot'),
      api.get('/especie'),
      api.get('/tipopesca')
    ]);

    return {
      spots: spotsRes.data,
      especies: especiesRes.data,
      tiposPesca: tiposPescaRes.data,
      timestamp: new Date().toISOString()
    };
  },
};

export const spotsApi = {
  getById: async (id: string) => {
    const { data } = await api.get(`/spot/${id}`);
    return data;
  },

  getEspecies: async (id: string) => {
    const { data } = await api.get(`/spot/${id}/especies`);
    return data;
  },

  getTiposPesca: async (id: string) => {
    const { data } = await api.get(`/spot/${id}/tipoPesca`);
    return data;
  },

  getCarnadas: async (id: string) => {
    const { data } = await api.get(`/spot/${id}/carnadas`);
    return data;
  },

  filtrar: async (params: { tiposPesca?: string[], especies?: string[] }) => {
    const queryParams = new URLSearchParams();
    
    if (params.tiposPesca?.length) {
      queryParams.append('tiposPesca', params.tiposPesca.join(','));
    }
    
    if (params.especies?.length) {
      queryParams.append('especies', params.especies.join(','));
    }

    const endpoint = params.especies?.length ? '/spot/filtrar-especies' : '/spot/filtrar';
    const { data } = await api.get(`${endpoint}?${queryParams.toString()}`);
    return data;
  },
};

export const capturasApi = {
  getMisCapturas: async () => {
    const { data } = await api.get('/capturas/mis-capturas');
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await api.post('/capturas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string, formData: FormData) => {
    const { data } = await api.patch(`/capturas/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/capturas/${id}`);
    return data;
  },
};

export default api;