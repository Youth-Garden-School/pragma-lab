export interface IAuthService {
  login(email: string, password: string, rememberMe: boolean): Promise<boolean>
  signup(email: string, password: string): Promise<boolean>
  logout(): Promise<void>
}
