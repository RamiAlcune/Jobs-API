import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface IUser extends Document {
  // Define your schema interface here
  name: string
  password: string
  email: string
  comparePassword(candidatePassword: string): Promise<boolean>
  createJWT(): string
}

const UserSchema: Schema = new Schema(
  {
    // Define your schema fields here
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 5,
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password as string, salt)
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

UserSchema.methods.createJWT = function (): string {
  const secret = process.env.JWT_SECRET
  const lifetime = process.env.JWT_LIFETIME

  if (!secret || !lifetime) {
    throw new Error(
      'JWT_SECRET or JWT_LIFETIME is not set in environment variables'
    )
  }

  const token = jwt.sign({ userID: this._id, name: this.name }, secret, {
    expiresIn: lifetime,
  })

  if (!token) {
    throw new Error('Failed to generate JWT')
  }

  return token
}
export default mongoose.model<IUser>('Users', UserSchema)
