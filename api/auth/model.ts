import { Schema, model } from 'mongoose'
import { IUser, IRole } from './types'

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: ObjectId
 *           example: 62e9a45a75013b1402ef4ad5
 *         firstName:
 *           type: string
 *           example: Jean Carlos
 *         lastName:
 *           type: string
 *           example: Valencia Barajas
 *         email:
 *           type: string
 *           example: mrjunior127@gmail.com
 *         password:
 *           type: string
 *           example: $2b$10$Ivon4lEEn4qV4UTfRioTref73UfbFlqScVkgjjtJp7h7Kn3YKwee6
 *         createdAt:
 *           type: string
 *           example: 2022-08-02T22:25:30.120+00:00
 *         updatedAt:
 *           type: string
 *           example: 2022-08-02T22:25:54.939+00:00
 */

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  token: String
}, { timestamps: true, versionKey: false })

const roleSchema = new Schema({
  name: String
}, { versionKey: false })

export const RoleSchema = model<IRole>('Role', roleSchema)
export const UserSchema = model<IUser>('User', userSchema)
