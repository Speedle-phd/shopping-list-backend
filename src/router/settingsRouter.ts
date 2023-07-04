import { Router } from 'express'
import {
   changePassword,
   changeUsername, deleteUser,
} from '../controller/settingsController'

const settingsRouter = Router()


settingsRouter.route('/').patch(changeUsername).delete(deleteUser)
settingsRouter.route('/password').patch(changePassword)

export { settingsRouter }
