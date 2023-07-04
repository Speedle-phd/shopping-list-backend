import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import User from '../models/userModels'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors'
import bcrypt from 'bcryptjs'

export const changeUsername: RequestHandler = async (req, res, next) => {
   const { userId } = req.user
   const {
      payload: { username },
   } = req.body

   const user = await User.findOneAndUpdate(
      { _id: userId },
      { username: username },
      {
         new: true,
         runValidators: true,
      }
   )
   if (!user) return next(new NotFoundError('User not found.'))
   // @ts-ignore
   const token = user.createJWT()
   res.status(StatusCodes.OK).json({
      user: { username: user.username, email: user.email },
      token,
   })
}

export const deleteUser : RequestHandler = async(req, res, next) => {
   const { userId } = req.user
   const user = await User.findOneAndDelete({_id: userId})
   if (!user) return next(new NotFoundError('User not found.'))
   res.status(StatusCodes.OK).json({user})
}
export const changePassword : RequestHandler = async(req, res, next) => {
   const { userId } = req.user
   const {payload: {oldPassword, newPassword}} = req.body
   if (!oldPassword || !newPassword)
   return next(new BadRequestError('Please provide an old and a new Password.'))
   const user = await User.findOne({_id: userId})
   if(!user) return next(new NotFoundError('User not found.'))
   // @ts-ignore
   const isMatching = await user.comparePW(oldPassword)
   if (!isMatching) return next(new UnauthorizedError('You entered the wrong password'))
   const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(newPassword, salt)
   const adjUser = await User.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword },
      {
         new: true,
         runValidators: true,
      }
   )
   res.status(StatusCodes.OK).json({adjUser})
}

