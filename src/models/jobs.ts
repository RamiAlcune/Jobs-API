import mongoose, { Schema, Document } from 'mongoose'

interface IJobs extends Document {
  // Define your schema interface here
  company: string
  position: string
  status: string
  createdBy: mongoose.Types.ObjectId
}

const JobsSchema: Schema = new Schema(
  {
    // Define your schema fields here
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide a position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
)

export default mongoose.model<IJobs>('Jobs', JobsSchema)
