
import { RequestHandler } from 'express'
import { ItemListModel as List } from '../models/listModels'
import { NotFoundError } from '../errors'
import { StatusCodes } from 'http-status-codes'

export const getAllItemLists: RequestHandler = async (req, res, next) => {
   const { userId } = req.user

   const lists = await List.find({ createdBy: userId })

      // FIXME: Maybe don't even uncomment this line because we don't want to throw an error but return just an empty array
   // if (lists.length < 1)
   //    return next(new NotFoundError("There isn't any data yet."))
   res.status(StatusCodes.OK).json({ listData: lists })
}
export const createNewItemList: RequestHandler = async (req, res, next) => {
   const { userId } = req.user
   const { payload } = req.body
   const data = { ...payload, createdBy: userId }

   const newList = await List.create(data)

   res.status(StatusCodes.CREATED).json({ newList })
}

export const getSingleItemList: RequestHandler = async (req, res, next) => {
   const { userId } = req.user
   const { listId } = req.params

   const list = await List.findOne({ _id: listId, createdBy: userId })
   if (!list)
      return next(
         new NotFoundError(
            `Haven't found a list matching the requested id: ${listId}`
         )
      )
   res.status(StatusCodes.OK).json({ list })
}

export const deleteItem: RequestHandler = async (req, res, next) => {
   const { userId } = req.user
   const { listId } = req.params
   const list = await List.findOneAndDelete({ _id: listId, createdBy: userId })
   if (!list)
      return next(
         new NotFoundError(
            `Haven't found a list matching the requested id: ${listId}`
         )
      )
   res.status(StatusCodes.OK).json({ list })
}

export const patchItemList: RequestHandler = async (req, res, next) => {
   const { userId } = req.user
   const {
      data: { adjustedItems, adjustedTitle },
   } = req.body
   const { listId } = req.params



   function calcCompleted(){
      return adjustedItems.reduce(
      (total: number, curr: CollectionItemsInterface) => {
         if (curr.completed) {
            total++
            return total
         }
         return total
      },
      0
      )
   }

   let completed;
   let newProgress;
   if(adjustedItems.length > 0 ){
      completed = calcCompleted()
      newProgress = (completed / adjustedItems.length) * 100
   }

   const list = await List.findOneAndUpdate(
      { _id: listId, createdBy: userId },
      { title: adjustedTitle, items: adjustedItems, progress: newProgress},
      { new: true,
      runValidators: true}
   )
   if (!list)
      return next(
         new NotFoundError(
            `Haven't found a list matching the requested id: ${listId}`
         )
      )
   res.status(StatusCodes.OK).json({ list })
}

export interface CollectionItemsInterface {
   amount: string
   name: string
   company: string
   department: string
   completed: boolean
   id: string
}

export const patchCompletedItem: RequestHandler = async (req, res, next) => {
   const { userId } = req.user
   const {
      items
   } = req.body
   const { listId } = req.params
   let completed = items.reduce(
      (total: number, curr: CollectionItemsInterface) => {
         if(curr.completed){
            total++
            return total
         }
         return total
      },
      0
   )
   const newProgress = completed / items.length * 100


   const list = await List.findOneAndUpdate(
      { _id: listId, createdBy: userId },
      { progress: newProgress, items: items },
      { new: true, runValidators: true }
   )
   if (!list)
      return next(
         new NotFoundError(
            `Haven't found a list matching the requested id: ${listId}`
         )
      )
   res.status(StatusCodes.OK).json({ list })
   // res.status(StatusCodes.OK).json({msg: "yes"})
}

