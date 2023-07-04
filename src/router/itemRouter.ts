import { Router } from 'express'
import { createNewItemList, deleteItem, getAllItemLists, getSingleItemList, patchCompletedItem, patchItemList } from '../controller/itemController'

const itemListRouter = Router()

itemListRouter.route('/').get(getAllItemLists).post(createNewItemList)
itemListRouter.route('/:listId').get(getSingleItemList).delete(deleteItem).patch(patchItemList)
itemListRouter.route('/completed/:listId').patch(patchCompletedItem)

export { itemListRouter }