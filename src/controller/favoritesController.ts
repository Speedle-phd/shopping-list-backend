import { RequestHandler } from 'express'
import { FavoritesModel as Fav } from '../models/favoritesModel'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors'



export const getAllFavorites: RequestHandler = async (req, res, next) => {
   // @ts-ignore
   const { userId } = req.user
   const favorites = await Fav.find({ createdBy: userId })
   res.status(StatusCodes.OK).json({ favorites })
}
export const getFavorite: RequestHandler = async (req, res, next) => {
   // @ts-ignore
   const { userId } = req.user
   const { favoritesId: id } = req.params

   const favorites = await Fav.find({ createdBy: userId, _id: id })
   if (!favorites) return next(new NotFoundError('Item was not found.'))
   res.status(StatusCodes.OK).json({ favorites })
}
export const createNewFavorites: RequestHandler = async (req, res, next) => {
   // @ts-ignore
   const { userId } = req.user
   const { data } = req.body
   if (!data.name) return next(new BadRequestError('Name must be provided.'))
   const isExisting = await Fav.findOne({ createdBy: userId, ...data })
   if (isExisting) return next(new BadRequestError('Item already exists'))
   const favorites = await Fav.create({ ...data, createdBy: userId })
   res.status(StatusCodes.OK).json({ favorites })
}
export const deleteFavorites: RequestHandler = async (req, res, next) => {
   // @ts-ignore
   const { userId } = req.user
   const { favoritesId: id } = req.params
   const favorite = await Fav.findOneAndDelete({ _id: id, createdBy: userId })
   if (!favorite) return next(new NotFoundError('Item was not found.'))
   res.status(StatusCodes.OK).json({ favorite })
}
export const patchFavorite: RequestHandler = async (req, res, next) => {
   // @ts-ignore
   const { userId } = req.user
   const { favoritesId: id } = req.params
   const { payload } = req.body
   const favorite = await Fav.findOneAndUpdate(
      { _id: id, createdBy: userId },
      payload,
      { runValidators: true, new: true }
   )
   if (!favorite) return next(new NotFoundError('Item was not found.'))
   res.status(StatusCodes.OK).json({ favorite })
}

export const getQueriedFavorites: RequestHandler = async(req, res, next) => {
   // @ts-ignore
   const { userId } = req.user
   const { q } = req.query as { q: string }
   const queryObject: { name: {} } = { name: '' }

   if (q) {
      queryObject.name = { $regex: q, $options: 'i' }
   }

   const favorites = await Fav.find({ createdBy: userId, ...queryObject })

   const sortedList = favorites.sort((a, b) => {
      const split_a = a?.name?.toLowerCase().split(q?.toLowerCase())
      const split_b = b?.name?.toLowerCase().split(q?.toLowerCase())
      if (!split_a || !split_b) return 1
      if (split_a[0].length > split_b[0].length) {
         return 1
      } else if (split_a[0].length < split_b[0].length) {
         return -1
      } else {
         return 0
      }
   })
   const splicedList = sortedList.splice(0, 5)

   res.status(StatusCodes.OK).json({ splicedList })
}
