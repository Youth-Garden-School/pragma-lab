export interface IHttpClient {
  /**
   * Thiết lập interceptor cho request.
   * @param interceptor Hàm thay đổi cấu hình request.
   */
  setRequestInterceptor: (
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>,
  ) => void

  /**
   * Thiết lập interceptor cho response.
   * @param interceptor Hàm xử lý dữ liệu response.
   */
  setResponseInterceptor: (interceptor: (data: any) => any | Promise<any>) => void

  /**
   * Gửi yêu cầu GET.
   * @param url Endpoint API.
   * @param headers Header tùy chọn.
   * @returns Promise chứa dữ liệu kiểu T.
   */
  get<T>(url: string, headers?: HeadersInit): Promise<T>

  /**
   * Gửi yêu cầu POST.
   * @param url Endpoint API.
   * @param body Dữ liệu gửi đi.
   * @param headers Header tùy chọn.
   * @returns Promise chứa dữ liệu kiểu T.
   */
  post<T>(url: string, body: any, headers?: HeadersInit): Promise<T>

  /**
   * Gửi yêu cầu PUT.
   * @param url Endpoint API.
   * @param body Dữ liệu gửi đi.
   * @param headers Header tùy chọn.
   * @returns Promise chứa dữ liệu kiểu T.
   */
  put<T>(url: string, body: any, headers?: HeadersInit): Promise<T>

  patch<T>(url: string, body: any, headers?: HeadersInit): Promise<T>

  /**
   * Gửi yêu cầu DELETE.
   * @param url Endpoint API.
   * @param headers Header tùy chọn.
   * @returns Promise chứa dữ liệu kiểu T.
   */
  delete<T>(url: string, headers?: HeadersInit): Promise<T>

  /**
   * Thiết lập header toàn cục.
   * @param key Khóa của header.
   * @param value Giá trị của header.
   */
  setHeader(key: string, value: string): void

  /**
   * Xóa header toàn cục.
   * @param key Khóa của header.
   */
  removeHeader(key: string): void
}
