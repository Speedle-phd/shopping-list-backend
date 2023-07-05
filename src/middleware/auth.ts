
import { UnauthorizedError } from '../errors'
import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

interface PayloadInterface {
   userId: string
   username: string
}

export const auth : RequestHandler = async(req, res, next) => {
   const authHeader = req.headers.authorization
   if(!authHeader?.startsWith('Bearer'))
      return next(new UnauthorizedError('Authentication invalid'))
   const token = authHeader.split(" ")[1]
   try {
      const payload = jwt.verify(
         token,
         process.env.JWT_SECRET!
      ) as PayloadInterface
      // @ts-ignore
      req.user = { userId: payload.userId, username: payload.username }

      next()
   } catch (error) {
      return next(new UnauthorizedError('Authentication invalid'))
   }
}