import { ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

   //set default --> contains customErrors but not mongoose errors!
   let customError = {
      statuscode: err.statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Something went wrong. Please try again',
   }
   if (err.name === 'ValidationError') {
      customError.msg = Object.values(err.errors)
         .map((item) => (item as { message: string }).message)
         .join(',')
      customError.statuscode = 400
   }
   if (err?.code === 11000) {
      customError.msg = `Duplicate value entered for ${Object.keys(
         err.keyValue
      )} field, please choose another value`
      customError.statuscode = 400
   }
   if (err.name === 'CastError') {
      customError.msg = `No item found with id : ${err.value}`
      customError.statuscode = 404
   }
   throw res.status(customError.statuscode).json({ msg: customError.msg })
}
