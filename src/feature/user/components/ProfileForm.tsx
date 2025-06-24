'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

// Sử dụng Role enum từ mockData
import { Role } from '@/feature/Admin/data/mockData'

// Types dựa trên cấu trúc API từ UserDialog và UsersList
interface UserProfile {
  userId: number
  name: string
  email: string
  phone: string
  address: string
  role: Role
  dateOfBirth?: Date | string
}

const profileSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  dateOfBirth: z.date().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export const ProfileForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: undefined,
    },
  })

  // Load user profile - tương tự như fetchUsers trong UsersList
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/users/me')
        if (!res.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const data = await res.json()
        // Giả sử API trả về { data: UserProfile } hoặc trực tiếp UserProfile
        const profile: UserProfile = data.data || data

        setUserProfile(profile)

        // Reset form với dữ liệu từ API
        form.reset({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
        })
      } catch (error: any) {
        console.error('Error loading profile:', error)
        toast.error(error.message || 'Không thể tải dữ liệu hồ sơ')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [form])

  // Update profile - tương tự như updateUser trong UserDialog
  const onSubmit = async (data: ProfileFormData) => {
    if (!userProfile) return

    try {
      setIsLoading(true)

      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        role: userProfile.role, // Giữ nguyên role hiện tại
      }

      const res = await fetch(`/api/users/${userProfile.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedData = await res.json()
      const updatedProfile = updatedData.data || updatedData

      setUserProfile(updatedProfile)
      toast.success('Cập nhật hồ sơ thành công')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Cập nhật hồ sơ thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (userProfile) {
      form.reset({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        address: userProfile.address,
        dateOfBirth: userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth) : undefined,
      })
      toast.info('Đã hủy thay đổi')
    }
  }

  // Loading state tương tự UsersList
  if (isLoading && !userProfile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hồ sơ của tôi</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Đang tải hồ sơ...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Helper function để lấy badge variant cho role
  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case Role.admin:
        return 'destructive'
      case Role.employee:
        return 'default'
      case Role.customer:
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hồ sơ của tôi</CardTitle>
        {userProfile && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Vai trò:</span>
            <Badge variant={getRoleBadgeVariant(userProfile.role)}>{userProfile.role}</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập email của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày sinh</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Chọn ngày</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                          className={cn('p-3 pointer-events-auto')}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProfileForm
