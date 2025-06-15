import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AUTH_MESSAGES } from '../../constants/validation'
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

const loginSchema = z.object({
  email: z.string().min(1, AUTH_MESSAGES.EMAIL_REQUIRED).email(AUTH_MESSAGES.EMAIL_INVALID),
  password: z.string().min(1, AUTH_MESSAGES.PASSWORD_REQUIRED),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps extends React.ComponentProps<'div'> {
  onSuccess?: () => void
  onSignupClick?: () => void
}

export function LoginForm({ className, onSuccess, onSignupClick, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      const success = await authService.login(data.email, data.password, data.rememberMe ?? false)
      if (success) {
        toast.success('Đăng nhập thành công')
        onSuccess?.()
      } else {
        toast.error('Email hoặc mật khẩu không đúng')
      }
    } catch (error) {
      console.error('Login error:', error)
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
                <div className="flex items-center justify-between">
                  <FormLabel>Mật khẩu</FormLabel>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      /* TODO: Implement forgot password */
                    }}
                    disabled={isLoading}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <FormControl>
                  <Input type="password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Ghi nhớ đăng nhập</FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingIndicator size="sm" />
              </div>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Chưa có tài khoản?{' '}
        <button
          type="button"
          className="underline underline-offset-4 hover:text-primary"
          onClick={onSignupClick}
          disabled={isLoading}
        >
          Đăng ký
        </button>
      </div>
    </div>
  )
}
