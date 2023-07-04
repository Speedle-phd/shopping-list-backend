import { RequestHandler } from "express";
import User from '../models/userModels'
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";
import { sendMagicLinkEmail } from "../utils/utils";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'


interface Auth {
   formData: {
      username?: string
      email: string
      password: string
   }
}

export const getAllItems : RequestHandler = (req,res,next) => {
   res.status(200).json({msg: "Works"})
}

export const loginUser : RequestHandler = async(req, res, next) => {
   const { formData : {email, password}} = req.body as Auth

   if(!email || !password) return next(new BadRequestError('Please provide an email and a password.'))
   const user = await User.findOne({ email })

   if(!user) return next(new UnauthorizedError('Invalid credentials'))
   // @ts-ignore
   const isMatching = await user.comparePW(password)
   
   if(!isMatching) return next(new UnauthorizedError('You entered the wrong password'))
   // @ts-ignore
   const token = user.createJWT()
   res.status(StatusCodes.OK).json({user: {username: user.username, email: user.email}, token})
}
export const registerUser : RequestHandler = async(req, res, next) => {
   const {email} = req.body.formData
   const userExist = await User.findOne({email})
   if(userExist){
      return next(new BadRequestError('Email already exists. Please take another email address.'))
   }

   const user = await User.create({...req.body.formData})
   // @ts-ignore
   const token = user.createJWT()
   res.status(StatusCodes.CREATED).json({ user: {username: user.username, email: user.email}, token})
}
export const resetPassword : RequestHandler = async(req, res, next) => {
   const {email} = req.body
   const newPassword = uuidv4()
   const salt = await bcrypt.genSalt(10)
   const hashedPassword= await bcrypt.hash(newPassword, salt)
   const user = await User.findOneAndUpdate({ email }, { password: hashedPassword }, {
      new: true,
      runValidators: true
   })
   if (!user) return next(new NotFoundError('User not found.'))
   await sendMagicLinkEmail(email, newPassword)
   res.status(StatusCodes.RESET_CONTENT).json({msg: "Password changed successfully", newPassword})
}

