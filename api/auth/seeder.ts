import { RoleSchema } from './model'

export const seederRoles = async (): Promise<boolean> => {
  const roles = [
    new RoleSchema({
      name: 'admin'
    }),
    new RoleSchema({
      name: 'doctor'
    }),
    new RoleSchema({
      name: 'secretary'
    }),
    new RoleSchema({
      name: 'patient'
    })
  ]

  let done = 0
  for (let i = 0; i < roles.length; i++) {
    roles[i].save(function (_err, _result) {
      done++
      if (done === roles.length) {
        return true
      }
    })
  }
  return true
}
