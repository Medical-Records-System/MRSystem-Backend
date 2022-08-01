import { Types, Document } from 'mongoose'

export interface IAuth extends Document {
  _id: Types.ObjectId
  email: string
  password: string
}

export interface INewUser {
  email: IAuth['email']
  password: IAuth['password']
}
