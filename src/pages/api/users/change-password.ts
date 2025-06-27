import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res
      .status(405)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(405)
          .setCode('METHOD_NOT_ALLOWED')
          .setMessage('Method not allowed')
          .build(),
      )
  }

  try {
    // Lấy session từ NextAuth
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user) {
      return res
        .status(401)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(401)
            .setCode('UNAUTHORIZED')
            .setMessage('Bạn cần đăng nhập để thực hiện chức năng này')
            .build(),
        )
    }

    // Lấy userId từ session
    const userId = session.user.id
    const { currentPassword, newPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Thiếu mật khẩu hiện tại hoặc mật khẩu mới')
            .build(),
        )
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
            .build(),
        )
    }

    // Kiểm tra mật khẩu mới không giống mật khẩu cũ
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Mật khẩu mới phải khác mật khẩu hiện tại')
            .build(),
        )
    }

    // Tìm user theo userId từ session
    const user = await prisma.users.findUnique({
      where: { userId: typeof userId === 'string' ? parseInt(userId) : userId },
    })

    if (!user) {
      return res
        .status(404)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(404)
            .setCode('NOT_FOUND')
            .setMessage('Không tìm thấy người dùng')
            .build(),
        )
    }

    // Verify current password
    if (!user.password) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Tài khoản này chưa thiết lập mật khẩu')
            .build(),
        )
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res
        .status(401)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(401)
            .setCode('UNAUTHORIZED')
            .setMessage('Mật khẩu hiện tại không đúng')
            .build(),
        )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.users.update({
      where: { userId: typeof userId === 'string' ? parseInt(userId) : userId },
      data: {
        password: hashedPassword,
      },
    })

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Đổi mật khẩu thành công')
          .build(),
      )
  } catch (error) {
    console.error('Change password error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Không thể đổi mật khẩu')
          .build(),
      )
  }
}
