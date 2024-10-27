import Jobs from '../models/jobs'
import asyncWrapper from '../middleware/async'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index'
import { Request, Response } from 'express'

const GetAllJobs = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user || !req.user.userID) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'User not authenticated' })
  }

  const jobs = await Jobs.find({ createdBy: req.user.userID }).sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs })
})

const UpdateJob = async (res: Response, req: Request) => {
  const { id } = req.params
  const { company, position } = req.body
  if (!company || !position) {
    throw new BadRequestError('Company or Position cannot be empty')
  }
  const job = await Jobs.findOneAndUpdate(
    { id: id, createdBy: req.user.userID },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const DeleteJob = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user || !req.user.userID) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'User not authenticated' })
  }

  const { id } = req.params
  const job = await Jobs.findOneAndDelete({
    _id: id,
    createdBy: req.user.userID,
  })
  console.log(job)
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`)
  }
  res.status(StatusCodes.OK).json({ job })
})

const CreateJob = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user || !req.user.userID) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'User not authenticated' })
  }

  const job = await Jobs.create({ ...req.body, createdBy: req.user.userID })
  res.status(StatusCodes.CREATED).json({ job })
})

export { GetAllJobs, CreateJob, UpdateJob, DeleteJob }
