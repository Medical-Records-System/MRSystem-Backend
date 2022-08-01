import { Schema, model } from 'mongoose'
import { IAuth } from './types'

const authSchema = new Schema({
  email: String,
  password: String
})

export const AuthSchema = model<IAuth>('Auth', authSchema)
