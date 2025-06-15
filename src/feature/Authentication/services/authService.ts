import { signIn, signOut } from 'next-auth/react'
import { IAuthService } from '../domain/interfaces/IAuthService'
import { authApi } from '../apis/AuthApi'

export class AuthService implements IAuthService {
  async login(email: string, password: string, rememberMe: boolean) {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        rememberMe: rememberMe.toString(),
        redirect: false,
      })

      if (result?.error) {
        return false
      }

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  async signup(email: string, password: string) {
    try {
      const response = await authApi.signup({ email, password })
      return response.statusCode === 201
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  async logout() {
    try {
      await signOut({ redirect: false })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
}

export const authService = new AuthService()
