import { IHttpClient } from './IHttpClient'

class HttpClient implements IHttpClient {
  private static instance: HttpClient
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private interceptors: {
    request?: (config: RequestInit) => RequestInit | Promise<RequestInit>
    response?: (data: any) => any | Promise<any>
  }

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
    this.interceptors = {}
  }

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient()
    }
    return HttpClient.instance
  }

  public setRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>,
  ) {
    this.interceptors.request = interceptor
  }

  setResponseInterceptor(interceptor: (data: any) => any | Promise<any>) {
    this.interceptors.response = interceptor
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`
    let config: RequestInit = {
      ...options,
      headers: { ...this.defaultHeaders, ...options.headers },
    }

    if (this.interceptors.request) {
      config = await this.interceptors.request(config)
    }

    try {
      const response = await fetch(fullUrl, config)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText, { cause: 'Error' })
      }

      let data = (await response.json()) as T

      if (this.interceptors.response) {
        data = await this.interceptors.response(data)
      }
      return data
    } catch (error) {
      console.error('HTTP Request Failed:', error)
      throw error
    }
  }

  public get<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers })
  }

  public post<T>(url: string, body: any, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    })
  }

  public put<T>(url: string, body: any, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    })
  }

  public patch<T>(url: string, body: any, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers,
    })
  }

  public delete<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', headers })
  }

  public setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value
  }

  public removeHeader(key: string) {
    delete this.defaultHeaders[key]
  }
}

export const httpClient = HttpClient.getInstance()
