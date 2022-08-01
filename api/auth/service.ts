import { AuthSchema } from './model'
import { INewUser } from './types'

export const storeUser = async (user: {email: string, password: string}): Promise<INewUser> => {
  const { email, password } = user
  const newUser = new AuthSchema({
    email,
    password
  })
  await newUser.save()
  return user
}
