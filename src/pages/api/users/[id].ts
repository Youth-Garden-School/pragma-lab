import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import prisma from '@/configs/prisma/prisma'
import bcrypt from 'bcrypt'
import { sessionWrapper } from '@/shared/utils/sessionWrapper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { id } = req.query
  if (id === 'me') {
    // Use sessionWrapper to get userId from session
    return sessionWrapper(async (req, res, userId) => {
      switch (req.method) {
        case 'GET':
          return await getUserById(req, res, userId)
        case 'PUT':
          return await updateUser(req, res, userId)
        case 'DELETE':
          return await deleteUser(req, res, userId)
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
    })(req, res)
  }
  let userId: number | null = parseInt(id as string)
  if (!userId || isNaN(userId)) {
    return res
      .status(400)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(400)
          .setCode('BAD_REQUEST')
          .setMessage('ID người dùng không hợp lệ')
          .build(),
      )
  }
  try {
    switch (req.method) {
      case 'GET':
        return await getUserById(req, res, userId)
      case 'PUT':
        return await updateUser(req, res, userId)
      case 'DELETE':
        return await deleteUser(req, res, userId)
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
  } catch (error) {
    console.error('API Error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Internal server error')
          .build(),
      )
  }
}

// GET /api/user/[id] - Lấy thông tin 1 user
async function getUserById(req: NextApiRequest, res: NextApiResponse, userId: number) {
  try {
    const user = await prisma.users.findUnique({
      where: { userId },
      select: {
        userId: true,
        phone: true,
        dateOfBirth: true,
        name: true,
        email: true,
        address: true,
        role: true,
        _count: {
          select: {
            tickets: true,
            trips: true,
            notifications: true,
          },
        },
      },
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

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Lấy thông tin người dùng thành công')
          .setData(user)
          .build(),
      )
  } catch (error) {
    console.error('Get user by ID error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Không thể lấy thông tin người dùng')
          .build(),
      )
  }
}

// PUT /api/user/[id] - Cập nhật thông tin user
async function updateUser(req: NextApiRequest, res: NextApiResponse, userId: number) {
  try {
    const { phone, dateOfBirth, name, email, address, password, role } = req.body

    console.log('Update request data:', { userId, body: req.body })

    // Validate at least one field to update
    if (
      phone === undefined &&
      dateOfBirth === undefined &&
      name === undefined &&
      email === undefined &&
      address === undefined &&
      password === undefined &&
      role === undefined
    ) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage('Không có trường nào để cập nhật')
            .build(),
        )
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { userId },
    })

    if (!existingUser) {
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

    // FIXED: Check for email/phone conflicts with other users - chỉ check khi có thay đổi thực sự
    const conflictConditions = []
    
    // Chỉ check email nếu email được cung cấp VÀ khác với email hiện tại
    if (email && email.trim() !== '' && email !== existingUser.email) {
      conflictConditions.push({ email: email.trim() })
    }
    
    // Chỉ check phone nếu phone được cung cấp VÀ khác với phone hiện tại
    if (phone && phone.trim() !== '' && phone !== existingUser.phone) {
      conflictConditions.push({ phone: phone.trim() })
    }

    // Chỉ thực hiện conflict check nếu có điều kiện để check
    if (conflictConditions.length > 0) {
      console.log('Checking conflicts for:', conflictConditions)
      
      const conflictUser = await prisma.users.findFirst({
        where: {
          AND: [
            { userId: { not: userId } },
            {
              OR: conflictConditions
            },
          ],
        },
      })

      if (conflictUser) {
        console.log('Conflict found:', conflictUser)
        
        // Xác định trường nào bị conflict
        let conflictMessage = 'Đã được sử dụng bởi người dùng khác: '
        const conflicts = []
        
        if (email && email === conflictUser.email) {
          conflicts.push('Email')
        }
        if (phone && phone === conflictUser.phone) {
          conflicts.push('Số điện thoại')
        }
        
        conflictMessage += conflicts.join(', ')

        return res
          .status(409)
          .json(
            new ApiResponseBuilder()
              .setStatusCode(409)
              .setCode('CONFLICT')
              .setMessage(conflictMessage)
              .build(),
          )
      }
    }

    // Prepare update data - chỉ update những field thực sự có giá trị
    const updateData: any = {}
    
    if (phone !== undefined && phone !== null) {
      updateData.phone = phone.trim()
    }
    
    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null
    }
    
    if (name !== undefined && name !== null) {
      updateData.name = name.trim()
    }
    
    if (email !== undefined && email !== null) {
      updateData.email = email.trim()
    }
    
    if (address !== undefined && address !== null) {
      updateData.address = address.trim()
    }
    
    if (role !== undefined && role !== null) {
      updateData.role = role
    }

    // Hash new password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password.trim(), 12)
    }

    console.log('Final update data:', updateData)

    const updatedUser = await prisma.users.update({
      where: { userId },
      data: updateData,
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

    console.log('User updated successfully:', updatedUser)

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Cập nhật thông tin người dùng thành công')
          .setData(updatedUser)
          .build(),
      )
  } catch (error) {
    console.error('Update user error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Không thể cập nhật thông tin người dùng')
          .build(),
      )
  }
}

// DELETE /api/user/[id] - Xóa user
async function deleteUser(req: NextApiRequest, res: NextApiResponse, userId: number) {
  try {
    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            tickets: true,
            trips: true,
            notifications: true,
          },
        },
      },
    })

    if (!existingUser) {
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

    // Check if user has related data
    const hasRelatedData =
      existingUser._count.tickets > 0 ||
      existingUser._count.trips > 0 ||
      existingUser._count.notifications > 0

    if (hasRelatedData) {
      return res
        .status(400)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(400)
            .setCode('BAD_REQUEST')
            .setMessage(
              'Không thể xóa người dùng vì còn dữ liệu liên quan (vé, chuyến đi, thông báo)',
            )
            .build(),
        )
    }

    await prisma.users.delete({
      where: { userId },
    })

    return res
      .status(200)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(200)
          .setCode('SUCCESS')
          .setMessage('Xóa người dùng thành công')
          .build(),
      )
  } catch (error) {
    console.error('Delete user error:', error)
    return res
      .status(500)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(500)
          .setCode('INTERNAL_SERVER_ERROR')
          .setMessage('Không thể xóa người dùng')
          .build(),
      )
  }
}