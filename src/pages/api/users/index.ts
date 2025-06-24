// pages/api/users/[id].js
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getAllUsers(req, res)
    case 'POST':
      return await createUser(req, res)
    case 'PUT':
      return await handlerChangePassword(req, res)
    default:
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
}

// GET /api/users - Lấy danh sách tất cả user
async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.users.findMany({
      select: {
        userId: true,
        phone: true,
        dateOfBirth: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    })
    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Lấy danh sách người dùng thành công')
          .setData(users)
          .build(),
      )
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Không thể lấy danh sách người dùng')
          .build(),
      )
  }
}

// POST /api/users - Tạo user mới
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email, phone, address, role, dateOfBirth, password } = req.body

    // Validate required fields
    if (!name || !email || !phone || !role) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Thiếu thông tin bắt buộc (name, email, phone, role)')
            .build(),
        )
    }

    // Check for duplicate email or phone
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    })
    if (existingUser) {
      return res
        .status(409)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(409)
            .setCode('CONFLICT')
            .setMessage('Email hoặc số điện thoại đã được sử dụng')
            .build(),
        )
    }

    // Hash password if provided
    let hashedPassword = undefined
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12)
    }

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        phone,
        address: address || '',
        role,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        password: hashedPassword || '',
      },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        dateOfBirth: true,
      },
    })

    return res
      .status(201)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(201)
          .setCode('SUCCESS')
          .setMessage('Tạo người dùng thành công')
          .setData(newUser)
          .build(),
      )
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Không thể tạo người dùng')
          .build(),
      )
  }
}

// PUT /api/users/change-password - Đổi mật khẩu cho user hiện tại
export async function handlerChangePassword(req: NextApiRequest, res: NextApiResponse) {
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
