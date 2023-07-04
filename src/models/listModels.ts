import mongoose, {model, Schema} from 'mongoose'


const listSchema = new Schema(
   {
      title: {
         type: String,
         minlength: [3, 'Please provide at least 3 characters'],
         maxlength: [20, 'No more than 20 characters allowed'],
         required: true,
      },
      type: {
         type: String,
         required: true,
         enum: ['food', 'misc', 'home'],
      },
      progress: {
         type: Number,
         default: 0,
      },
      items: {
         type: Array,
         default: [],
      },
      createdBy: {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         required: [true, 'Please provide user'],
      },
   },
   { timestamps: true }
)

const ItemListModel = model('itemLists', listSchema)
export {ItemListModel}