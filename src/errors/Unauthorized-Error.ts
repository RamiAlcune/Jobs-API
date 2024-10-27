import CustomApiError from './CustomAPI-Error'
import { StatusCodes } from 'http-status-codes'

class UnauthorizedError extends CustomApiError {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default UnauthorizedError
