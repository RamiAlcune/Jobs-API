import jwt, { JwtPayload } from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/index'
// Remove unused import
// import User from '../models/user'
import { Request, Response, NextFunction } from 'express'

// Extend the Express Request interface using declaration merging
declare global {
  namespace Express {
    interface Request {
      user: { userID: string; name: string }
    }
  }
}

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication invalid: No token provided')
  }
  const token = authHeader.split(' ')[1] // Remove 'Bearer ' prefix
  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined')
    }
    console.log('Token:', token)
    console.log('JWT Secret:', jwtSecret)
    const payload = jwt.verify(token, jwtSecret) as JwtPayload
    if (!payload.userID || !payload.name) {
      throw new UnauthorizedError('Token payload is invalid')
    }
    req.user = { userID: payload.userID, name: payload.name }
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(`Authentication invalid: ${error.message}`)
    }
    throw new UnauthorizedError('Authentication invalid')
  }
}

// Export the middleware
export default auth
