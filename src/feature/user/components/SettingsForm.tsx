'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Types cho API payload
interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

interface ChangePasswordResponse {
  message: string
  success: boolean
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số',
      ),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export const SettingsForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Change password function - tương tự pattern updateUser/createUser trong UserDialog
  const changePassword = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true)

      const changePasswordPayload: ChangePasswordPayload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }

      const res = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changePasswordPayload),
      })

      if (!res.ok) {
        // Xử lý các lỗi cụ thể từ API
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.message || errorData.error || 'Failed to change password'
        throw new Error(errorMessage)
      }

      const result: ChangePasswordResponse = await res.json()

      toast.success(result.message || 'Đổi mật khẩu thành công')

      // Reset form và hide passwords sau khi thành công
      form.reset()
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (error: any) {
      console.error('Error changing password:', error)

      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Failed to change password'

      if (error.message) {
        errorMessage = error.message
      } else if (error.name === 'TypeError') {
        errorMessage = 'Network error. Please check your connection.'
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data)
  }

  const handleCancel = () => {
    form.reset()
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    toast.info('Đã hủy đổi mật khẩu')
  }

  // Toggle password visibility functions
  const toggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword)
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword)
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Cài đặt tài khoản</CardTitle>
        <p className="text-sm text-muted-foreground">Đổi mật khẩu để bảo vệ tài khoản của bạn</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu hiện tại *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu hiện tại"
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={toggleCurrentPassword}
                            disabled={isLoading}
                            tabIndex={-1}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu mới"
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={toggleNewPassword}
                            disabled={isLoading}
                            tabIndex={-1}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Xác nhận mật khẩu mới"
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={toggleConfirmPassword}
                            disabled={isLoading}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Có thể thêm các setting khác ở đây */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Mẹo bảo mật</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sử dụng mật khẩu mạnh, duy nhất cho tài khoản của bạn</li>
              <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
              <li>• Thay đổi mật khẩu thường xuyên</li>
              <li>• Sử dụng trình quản lý mật khẩu để tạo và lưu trữ mật khẩu</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SettingsForm
