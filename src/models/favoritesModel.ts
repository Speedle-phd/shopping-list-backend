import mongoose, {model} from "mongoose";

const Favorites = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'Please provide a name.'],
      },
      company: {
         type: String,
      },
      department: {
         type: String,
         enum: ["", 'Bakery', 'Fruit and veg', 'Freezer', 'Household', 'Meat', 'Supplies'],
      },
      createdBy: {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         required: [true, 'Please provide user'],
      },
   },
   { timestamps: true }
)

export const FavoritesModel = model("FavoritesSchema", Favorites)
