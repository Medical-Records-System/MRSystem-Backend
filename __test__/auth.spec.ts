import request from 'supertest'

import { appServer, routePrefix } from '../app'
import { AuthController } from '../api/auth/controller'
import { MongoService } from '../services/mongoDb'

jest.mock('../api/auth/service')

beforeEach(async () => {
  const authController = AuthController.getInstance
  await authController.registerUser('admin@admin.com', '1234')
})

describe('AUTH CRUD WITH JWT TOKEN (FAILEDS)', () => {
  test('should return 401 when no jwt token available', async () => {
    const res = await request(appServer)
      .get(`${routePrefix}/`)
    expect(res.statusCode).toBe(401)
  })
  test('should return 400 when no data is provided', async () => {
    const res = await request(appServer)
      .post(`${routePrefix}/auth/login`)
      .send()
    expect(res.statusCode).toBe(400)
  })
})

describe('AUTH CRUD WITH JWT TOKEN (SUCCESS)', () => {
  test('should return 200 and token for successfull login', async () => {
    const res = await request(appServer)
      .post(`${routePrefix}/auth/login`)
      .set('Accept', 'application/json')
      .send({ email: 'admin@admin.com', password: '1234' })
    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeDefined()
  })
})

afterAll(async () => {
  const mongoService = MongoService.getInstance
  await mongoService.disconnnect()
})
