import { NextApiRequest, NextApiResponse } from 'next'
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
    // TODO: Lấy userId từ session, tạm hardcode userId = 1
    const userId = 1
    const { currentPassword, newPassword } = req.body
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
    const user = await prisma.users.findUnique({ where: { userId } })
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
    const isMatch = await bcrypt.compare(currentPassword, user.password || '')
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
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.users.update({
      where: { userId },
      data: { password: hashedPassword },
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
