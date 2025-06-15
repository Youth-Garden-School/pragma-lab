import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { AppException } from '../exceptions/AppException'
import { sendError } from './responseHelper'

type HandlerWithUser = (req: NextApiRequest, res: NextApiResponse, userId: number) => Promise<void>

export function sessionWrapper(handler: HandlerWithUser): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req, res, authOptions)

      if (!session?.user?.id) {
        throw AppException.Unauthorized()
      }

      const userId = parseInt(session.user.id, 10)
      if (isNaN(userId)) {
        throw AppException.Unauthorized('Invalid user ID')
      }

      return await handler(req, res, userId)
    } catch (error) {
      return sendError(res, error as Error)
    }
  }
}
