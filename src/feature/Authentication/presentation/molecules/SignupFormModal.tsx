import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AUTH_CONSTANTS, AUTH_MESSAGES } from '../../constants/validation'
import { authService } from '../../services/authService'
import { toast } from 'sonner'
import { LoadingIndicator } from '@/components/Common/LoadingIndicator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'

const signupSchema = z
  .object({
    email: z.string().min(1, AUTH_MESSAGES.EMAIL_REQUIRED).email(AUTH_MESSAGES.EMAIL_INVALID),
    password: z
      .string()
      .min(1, AUTH_MESSAGES.PASSWORD_REQUIRED)
      .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, AUTH_MESSAGES.PASSWORD_MIN_LENGTH)
      .max(AUTH_CONSTANTS.PASSWORD_MAX_LENGTH, AUTH_MESSAGES.PASSWORD_MAX_LENGTH),
    confirmPassword: z.string().min(1, AUTH_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_MESSAGES.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

interface SignupFormProps extends React.ComponentProps<'div'> {
  onSuccess?: () => void
}

export function SignupForm({ className, onSuccess, ...props }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true)
      const success = await authService.signup(data.email, data.password)
      if (success) {
        toast.success('Đăng ký thành công')
        onSuccess?.()
      } else {
        toast.error('Đăng ký thất bại')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('space-y-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoadingIndicator size="sm" /> : 'Đăng ký'}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Đã có tài khoản?{' '}
        <button
          type="button"
          className="underline underline-offset-4 hover:text-primary"
          onClick={() => onSuccess?.()}
          disabled={isLoading}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  )
}
