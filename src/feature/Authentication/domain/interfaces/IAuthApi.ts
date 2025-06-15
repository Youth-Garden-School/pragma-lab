import { SignupRequestDto } from '../dto/request/SignupRequestDto'
import { SignupResponseDto } from '../dto/response/SignupResponseDto'
import { ApiResponse } from '@/shared/types/response'

export interface IAuthApi {
  signup(data: SignupRequestDto): Promise<ApiResponse<SignupResponseDto>>
  login(email: string, password: string, rememberMe: boolean): Promise<ApiResponse>
  logout(): Promise<ApiResponse>
}
