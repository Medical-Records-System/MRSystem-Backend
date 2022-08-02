import { Schema, model } from 'mongoose'
import { IUser } from './types'

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  token: String
}, { timestamps: true })

export const UserSchema = model<IUser>('Users', userSchema)
