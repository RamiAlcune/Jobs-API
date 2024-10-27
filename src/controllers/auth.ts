import User from '../models/user'
import bcrypt from 'bcryptjs'
import { BadRequestError, UnauthorizedError } from '../errors/index'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

const Register = async (req: Request, res: Response) => {
  // Create a new user instance
  const user = await User.create({ ...req.body })

  // Now user is an instance of the User model and should have createJWT method
  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthorizedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

export { Register, Login }
