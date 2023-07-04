import { StatusCodes } from "http-status-codes"

export abstract class CustomError extends Error{
   constructor(public message: string){
      super(message)
   }
}

export class BadRequestError extends CustomError{
   statuscode: number
   constructor(public message: string){
      super(message)
      this.statuscode = StatusCodes.BAD_REQUEST
   }
}

export class UnauthorizedError extends CustomError{
   statuscode: number
   constructor(public message: string){
      super(message)
      this.statuscode = StatusCodes.UNAUTHORIZED
   }
}
export class NotFoundError extends CustomError{
   statuscode: number
   constructor(public message: string){
      super(message)
      this.statuscode = StatusCodes.NOT_FOUND
   }
}




