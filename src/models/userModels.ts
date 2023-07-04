import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [true, 'Please provide an username'],
      minlength: [3, 'Please provide at least three characters'],
      maxlength: 30,
   },
   email: {
      type: String,
      required: [true, 'Please provide an email address'],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         'Please provide a valid email',
      ],
      unique: true,
   },
   password: {
      type: String,
      required: true,
      minlength: [6, 'Password has to be at least 6 characters long.'],
   }
}, {timestamps: true})

UserSchema.pre('save', async function() {
   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
   const secret = process.env.JWT_SECRET as jwt.Secret
   return jwt.sign(
      {
         userId: this._id, username: this.username
      },
      secret,
      {
         expiresIn: process.env.JWT_LIFETIME
      }
   )
}

UserSchema.methods.comparePW = async function(candidatePassword: string) {
   const isMatch = await bcrypt.compare(candidatePassword, this.password)
   return isMatch
}
const mongooseModel = mongoose.model("users", UserSchema)
export default mongooseModel