import { z } from 'zod'
import { AUTH_MESSAGES, AUTH_CONSTANTS } from '../../../constants/validation'

export const signupRequestSchema = z.object({
  email: z.string().min(1, AUTH_MESSAGES.EMAIL_REQUIRED).email(AUTH_MESSAGES.EMAIL_INVALID),
  password: z
    .string()
    .min(1, AUTH_MESSAGES.PASSWORD_REQUIRED)
    .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, AUTH_MESSAGES.PASSWORD_MIN_LENGTH)
    .max(AUTH_CONSTANTS.PASSWORD_MAX_LENGTH, AUTH_MESSAGES.PASSWORD_MAX_LENGTH),
})

export type SignupRequestDto = z.infer<typeof signupRequestSchema>

export {}
