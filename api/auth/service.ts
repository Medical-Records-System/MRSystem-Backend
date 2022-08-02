import { UserSchema } from './model'
import { INewUser } from './types'

export const storeUser = async (user: {firstName: string, lastName: string, email: string, password: string, token: string}): Promise<INewUser> => {
  const { firstName, lastName, email, password, token } = user
  const newUser = new UserSchema({
    firstName,
    lastName,
    email,
    password,
    token
  })
  await newUser.save()
  return user
}
