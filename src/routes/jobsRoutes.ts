import express from 'express'
import {
  GetAllJobs,
  CreateJob,
  UpdateJob,
  DeleteJob,
} from '../controllers/jobsControllers'
const router = express.Router()

router.route('/').get(GetAllJobs).post(CreateJob)
router.route('/:id').patch(UpdateJob).delete(DeleteJob)

export default router
