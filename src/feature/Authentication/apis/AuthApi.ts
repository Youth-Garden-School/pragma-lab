import { httpClient } from '@/configs/http-client/HttpClient'
import { IAuthApi } from '../domain/interfaces/IAuthApi'
import { SignupRequestDto } from '../domain/dto/request/SignupRequestDto'
import { SignupResponseDto } from '../domain/dto/response/SignupResponseDto'
import { ApiResponse } from '@/shared/types/response'
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum'

export class AuthApi implements IAuthApi {
  async signup(data: SignupRequestDto): Promise<ApiResponse<SignupResponseDto>> {
    return httpClient.post<ApiResponse<SignupResponseDto>>(ApiEndpointEnum.AUTH_SIGNUP, data)
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<ApiResponse> {
    return httpClient.post<ApiResponse>(ApiEndpointEnum.AUTH_LOGIN, { email, password, rememberMe })
  }

  async logout(): Promise<ApiResponse> {
    return httpClient.post<ApiResponse>(ApiEndpointEnum.AUTH_LOGOUT, {})
  }
}

export const authApi = new AuthApi()
