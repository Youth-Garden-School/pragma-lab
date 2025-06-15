import { NextApiRequest, NextApiResponse } from 'next'
import { AppException } from '../exceptions/AppException'
import { sendError } from '../utils/responseHelper'

export function errorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.error('API Error:', error)
      return sendError(res, error as Error)
    }
  }
}
