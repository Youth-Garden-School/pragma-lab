import { z } from 'zod'

export const signupResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string(),
  }),
})

export type SignupResponseDto = z.infer<typeof signupResponseSchema>
