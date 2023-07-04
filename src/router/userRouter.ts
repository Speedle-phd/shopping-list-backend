
import { Router } from 'express'
import { loginUser, registerUser, resetPassword } from '../controller/userController'

const userRouter = Router()

userRouter.route('/login').post(loginUser)
userRouter.route('/register').post(registerUser)
userRouter.route('/reset').patch(resetPassword)


export { userRouter }
