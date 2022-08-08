import { Types, Document } from 'mongoose'

export interface IUser extends Document {
  _id: Types.ObjectId
  firstName: string
  lastName: string
  email: string
  password: string
  roles: Types.ObjectId[] | string[]
  token: string
}

export interface INewUser {
  firstName: IUser['firstName']
  lastName: IUser['lastName']
  email: IUser['email']
  password: IUser['password']
  roles: IUser['roles']
}

export interface IRole extends Document {
  _id: Types.ObjectId
  name: string
}

export interface INewRole {
  name: IRole['name']
}
