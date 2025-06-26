import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect } from 'react'

interface BuyerInfo {
  fullName: string
  phone: string
  email: string
  note: string
  wantInvoice: boolean
}

interface BuyerInfoStepProps {
  buyerInfo: BuyerInfo
  onChange: (field: keyof BuyerInfo, value: string | boolean) => void
  onBack: () => void
  onSubmit: () => void
}

export default function BuyerInfoStep({
  buyerInfo,
  onChange,
  onBack,
  onSubmit,
}: BuyerInfoStepProps) {
  // Lấy thông tin người dùng hiện tại khi mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me', {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.data) {
            if (data.data.name) onChange('fullName', data.data.name)
            if (data.data.email) onChange('email', data.data.email)
            if (data.data.phone) onChange('phone', data.data.phone)
          }
        }
      } catch (e) {
        // Có thể xử lý lỗi nếu cần
      }
    }
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Họ và tên *</label>
        <Input value={buyerInfo.fullName} onChange={(e) => onChange('fullName', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Số điện thoại *</label>
        <Input
          type="tel"
          value={buyerInfo.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email để nhận vé</label>
        <Input
          type="email"
          value={buyerInfo.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={buyerInfo.wantInvoice}
          onChange={(e) => onChange('wantInvoice', e.target.checked)}
        />
        <span>Tôi muốn xuất hóa đơn</span>
      </div>
      <div>
        <label className="block text-sm font-medium">Ghi chú</label>
        <textarea
          rows={3}
          className="w-full border rounded px-3 py-2"
          value={buyerInfo.note}
          onChange={(e) => onChange('note', e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="bg-gray-600 hover:bg-red-500 text-white hover:text-white"
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Button className="bg-cyan-400 hover:bg-cyan-400 text-white" onClick={onSubmit}>
          Đặt vé
        </Button>
      </div>
    </div>
  )
}
