import { Role } from '@prisma/client'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { AppException } from '@/shared/exceptions/AppException'
import {
  signupRequestSchema,
  SignupRequestDto,
} from '@/feature/Authentication/domain/dto/request/SignupRequestDto'
import {
  signupResponseSchema,
  SignupResponseDto,
} from '@/feature/Authentication/domain/dto/response/SignupResponseDto'
import { ApiResponseBuilder } from '@/shared/utils/ApiResponseBuilder'
import { authRepository } from '@/feature/Authentication/infrastructure/repositories/AuthRepository'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    const error = AppException.BadRequest('Method not allowed')
    return res
      .status(error.statusCode)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(error.statusCode)
          .setCode(error.code)
          .setMessage(error.message)
          .build(),
      )
  }

  try {
    // Validate request body
    const validatedData = signupRequestSchema.parse(req.body) as SignupRequestDto
    const { email, password } = validatedData

    // Check if user already exists
    const existingUser = await authRepository.findByEmail(email)
    if (existingUser) {
      const error = AppException.Conflict('Email đã được sử dụng')
      return res
        .status(error.statusCode)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(error.statusCode)
            .setCode(error.code)
            .setMessage(error.message)
            .build(),
        )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await authRepository.createUser({
      email,
      password: hashedPassword,
      name: email.split('@')[0], // Default name from email
      role: Role.customer,
      phone: '',
    })

    // Create response
    const response: SignupResponseDto = {
      message: 'Đăng ký thành công',
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
      },
    }

    // Validate response
    signupResponseSchema.parse(response)

    return res
      .status(201)
      .json(
        new ApiResponseBuilder<SignupResponseDto>()
          .setStatusCode(201)
          .setCode('SUCCESS')
          .setMessage(response.message)
          .setData(response)
          .build(),
      )
  } catch (error) {
    if (error instanceof AppException) {
      return res
        .status(error.statusCode)
        .json(
          new ApiResponseBuilder()
            .setStatusCode(error.statusCode)
            .setCode(error.code)
            .setMessage(error.message)
            .build(),
        )
    }
    console.error('Signup error:', error)
    const err = AppException.InternalServerError('Có lỗi xảy ra, vui lòng thử lại')
    return res
      .status(err.statusCode)
      .json(
        new ApiResponseBuilder()
          .setStatusCode(err.statusCode)
          .setCode(err.code)
          .setMessage(err.message)
          .build(),
      )
  }
}
