// Simple API service for sources management
const apiService = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await fetch(url, { method: 'GET', ...config });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  post: async <T>(url: string, data: any, config?: any): Promise<T> => {
    const response = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...config 
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  put: async <T>(url: string, data: any, config?: any): Promise<T> => {
    const response = await fetch(url, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...config 
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response = await fetch(url, { method: 'DELETE', ...config });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  patch: async <T>(url: string, data: any, config?: any): Promise<T> => {
    const response = await fetch(url, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...config 
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
};

// Types for Sources Management
export interface Source {
  id: number;
  name: string;
  url_or_handle: string;
  type: 'x' | 'facebook' | 'news';
  description?: string;
  status: 'active' | 'disabled' | 'error';
  fetch_count: number;
  last_fetched: string | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  data_id: number | null;
  visible: boolean;
  cm_media: boolean;
  metadata: Record<string, any>;
}

export interface SourcesResponse {
  success: boolean;
  data: Source[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

export interface SourceResponse {
  success: boolean;
  data: Source;
  message?: string;
  error?: string;
}

export interface SourcesStats {
  total_sources: number;
  active_sources: number;
  disabled_sources: number;
  error_sources: number;
  news_sources: number;
  x_sources: number;
  facebook_sources: number;
  total_fetches: number;
  active_30d: number;
  visible_sources: number;
  cm_media_sources: number;
}

export interface SourcesStatsResponse {
  success: boolean;
  data: SourcesStats;
  error?: string;
}

export interface CreateSourceRequest {
  name: string;
  url_or_handle: string;
  type: 'x' | 'facebook' | 'news';
  description?: string;
  status?: 'active' | 'disabled' | 'error';
  visible?: boolean;
  metadata?: Record<string, any>;
  cm_media?: boolean;
}

export interface UpdateSourceRequest {
  name?: string;
  url_or_handle?: string;
  type?: 'x' | 'facebook' | 'news';
  description?: string;
  status?: 'active' | 'disabled' | 'error';
  visible?: boolean;
  metadata?: Record<string, any>;
  cm_media?: boolean;
}

export interface SourcesFilters {
  type?: 'x' | 'facebook' | 'news';
  status?: 'active' | 'disabled' | 'error';
  visible?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'type' | 'status' | 'fetch_count' | 'last_fetched' | 'created_at';
  sort_order?: 'ASC' | 'DESC';
  cm_media?: boolean;
}

class SourcesApiService {
  private readonly baseEndpoint = '/sources';

  /**
   * Get all sources with optional filters and pagination
   */
  async getSources(filters: SourcesFilters = {}): Promise<SourcesResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const url = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint;
      
      const response = await apiService.get<SourcesResponse>(url);
      return response;
    } catch (error) {
      console.error('Error fetching sources:', error);
      throw error;
    }
  }

  /**
   * Get sources statistics for KPI cards
   */
  async getSourcesStats(): Promise<SourcesStatsResponse> {
    try {
      const response = await apiService.get<SourcesStatsResponse>(`${this.baseEndpoint}/stats`);
      return response;
    } catch (error) {
      console.error('Error fetching sources stats:', error);
      throw error;
    }
  }

  /**
   * Get a single source by ID
   */
  async getSource(id: number): Promise<SourceResponse> {
    try {
      const response = await apiService.get<SourceResponse>(`${this.baseEndpoint}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching source ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new source
   */
  async createSource(sourceData: CreateSourceRequest): Promise<SourceResponse> {
    try {
      const response = await apiService.post<SourceResponse>(this.baseEndpoint, sourceData);
      return response;
    } catch (error) {
      console.error('Error creating source:', error);
      throw error;
    }
  }

  /**
   * Update an existing source
   */
  async updateSource(id: number, sourceData: UpdateSourceRequest): Promise<SourceResponse> {
    try {
      const response = await apiService.put<SourceResponse>(`${this.baseEndpoint}/${id}`, sourceData);
      return response;
    } catch (error) {
      console.error(`Error updating source ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a source (Super Admin only)
   */
  async deleteSource(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>(`${this.baseEndpoint}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting source ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update source status (toggle active/disabled/error)
   */
  async updateSourceStatus(id: number, status: 'active' | 'disabled' | 'error'): Promise<SourceResponse> {
    try {
      const response = await apiService.patch<SourceResponse>(`${this.baseEndpoint}/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error(`Error updating source ${id} status:`, error);
      throw error;
    }
  }

  /**
   * Track a successful fetch for a source (Internal use)
   */
  async trackFetch(id: number): Promise<{ success: boolean; data: { fetch_count: number; last_fetched: string }; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: { fetch_count: number; last_fetched: string }; message: string }>(`${this.baseEndpoint}/${id}/fetch`, {});
      return response;
    } catch (error) {
      console.error(`Error tracking fetch for source ${id}:`, error);
      throw error;
    }
  }

  /**
   * Validate source URL/handle format
   */
  validateSourceUrl(url: string, type: 'x' | 'facebook' | 'news'): boolean {
    if (!url || typeof url !== 'string') return false;
    
    switch (type) {
      case 'x':
        // Twitter handles can be @username or https://twitter.com/username
        return url.startsWith('@') || url.includes('twitter.com') || url.includes('x.com');
      case 'facebook':
        // Facebook pages must be URLs
        return url.includes('facebook.com');
      case 'news':
        // News sources should be valid URLs
        return url.startsWith('http://') || url.startsWith('https://');
      default:
        return false;
    }
  }

  /**
   * Format URL/handle for display
   */
  formatUrlForDisplay(url: string, type: 'x' | 'facebook' | 'news'): string {
    switch (type) {
      case 'x':
        if (url.startsWith('@')) return url;
        if (url.includes('twitter.com/') || url.includes('x.com/')) {
          const username = url.split('/').pop();
          return username ? `@${username}` : url;
        }
        return url.startsWith('@') ? url : `@${url}`;
      case 'facebook':
        if (url.includes('facebook.com/')) {
          return url.replace('https://www.facebook.com/', '').replace('https://facebook.com/', '');
        }
        return url;
      case 'news':
        return url;
      default:
        return url;
    }
  }

  /**
   * Get source type color for UI
   */
  getSourceTypeColor(type: 'x' | 'facebook' | 'news'): string {
    switch (type) {
      case 'x':
        return 'bg-blue-100 text-blue-800';
      case 'facebook':
        return 'bg-indigo-100 text-indigo-800';
      case 'news':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get source status color for UI
   */
  getSourceStatusColor(status: 'active' | 'disabled' | 'error'): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'disabled':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Format last fetched time for display
   */
  formatLastFetched(lastFetched: string | null): string {
    if (!lastFetched) return 'Never';
    
    const date = new Date(lastFetched);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
}

// Export singleton instance
export const sourcesApi = new SourcesApiService();
export default sourcesApi; 