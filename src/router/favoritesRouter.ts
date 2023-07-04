import { Router } from 'express'
import { createNewFavorites, deleteFavorites, getAllFavorites, getFavorite, getQueriedFavorites, patchFavorite } from '../controller/favoritesController'


const favoritesRouter = Router()

favoritesRouter.route('/').get(getAllFavorites).post(createNewFavorites)
favoritesRouter.route('/item/:favoritesId').delete(deleteFavorites).get(getFavorite).patch(patchFavorite)
favoritesRouter.route('/queries').get(getQueriedFavorites)

export { favoritesRouter }
