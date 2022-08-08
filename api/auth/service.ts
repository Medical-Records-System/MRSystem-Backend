import { UserSchema, RoleSchema } from './model'
import { INewUser, INewRole } from './types'

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

export const storeRole = async (role: { name: string}): Promise<INewRole> => {
  const { name } = role
  const newRole = new RoleSchema({
    name
  })
  await newRole.save()
  return role
}
