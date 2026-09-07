const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export class ApiClient {
  public static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sellora_token');
    }
    return null;
  }

  public static setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sellora_token', token);
    }
  }

  public static clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sellora_token');
      localStorage.removeItem('sellora_user');
    }
  }

  public static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        this.clearToken();
      }

      let result: any = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        const errMsg = result?.message || result?.error || (typeof result === 'string' ? result : `Server error (${response.status})`);
        throw new Error(errMsg);
      }

      return result.data as T;
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to SELLORA API server. Please check your connection.');
      }
      throw error;
    }
  }

  public static get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public static post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public static put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public static delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
