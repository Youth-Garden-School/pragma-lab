import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AUTH_MESSAGES } from '../../constants/validation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

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
      // TODO: Implement login logic
      console.log('Login data:', data)
      onSuccess?.()
    } catch (error) {
      console.error('Login error:', error)
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
                  <Input placeholder="example@email.com" {...field} />
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
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Chưa có tài khoản?{' '}
        <button
          type="button"
          className="underline underline-offset-4 hover:text-primary"
          onClick={onSignupClick}
        >
          Đăng ký
        </button>
      </div>
    </div>
  )
}
