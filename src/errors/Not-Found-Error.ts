import CustomApiError from './CustomAPI-Error'
import { StatusCodes } from 'http-status-codes'

class NotFoundError extends CustomApiError {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

export default NotFoundError
