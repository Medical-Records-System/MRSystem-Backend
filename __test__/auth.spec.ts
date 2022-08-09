import request from 'supertest'

import { appServer, routePrefix } from '../app'
import { seederRoles } from '../api/auth/seeder'
import { AuthController } from '../api/auth/controller'
import { MongoService } from '../services/mongoDb'

jest.mock('../api/auth/service')

let token: string = ''

beforeEach(async () => {
  await seederRoles()
  const authController = AuthController.getInstance
  await authController.registerUser({ firstName: 'Jean Carlos', lastName: 'Valencia', email: 'admin@admin.com', password: '1234', roles: ['admin'] })
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
  test('should return 401 when credentials is invalid', async () => {
    const res = await request(appServer)
      .post(`${routePrefix}/auth/login`)
      .send({ email: 'admin@admin.com', password: '123' })
    expect(res.statusCode).toBe(401)
    expect(res.body.data.error).toContain('Invalid credentials')
  })
  test('should return 400 when no data is provided', async () => {
    const errorRequiredFirstName = {
      firstName: {
        msg: 'The first name is required'
      }
    }
    const res = await request(appServer)
      .post(`${routePrefix}/auth/register`)
      .send()
    expect(res.statusCode).toBe(400)
    expect(res.body.data.errors).toMatchObject(errorRequiredFirstName)
  })
  test('should return 400 when user is already registered', async () => {
    const res = await request(appServer)
      .post(`${routePrefix}/auth/register`)
      .send({ firstName: 'Jean Carlos', lastName: 'Valencia', email: 'admin@admin.com', password: '1234', confirmPassword: '1234' })
    expect(res.statusCode).toBe(400)
    expect(res.body.data.error).toContain('User is already register')
  })
})

describe('AUTH CRUD WITH JWT TOKEN (SUCCESS)', () => {
  test('should return 200 and token for successfull login', async () => {
    const res = await request(appServer)
      .post(`${routePrefix}/auth/login`)
      .set('Accept', 'application/json')
      .send({ email: 'admin@admin.com', password: '1234' })
    expect(res.statusCode).toBe(200)
    expect(res.body.data.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/)
  })
  test('should return 200 and new user registered', async () => {
    const newUser = {
      firstName: 'Jean Carlos',
      lastName: 'Valencia Barajas',
      email: 'mrjunior127@gmail.com',
      password: '12345',
      confirmPassword: '12345',
      role: ['doctor']
    }
    const responseExpectedRegister = {
      firstName: 'Jean Carlos',
      lastName: 'Valencia Barajas',
      email: 'mrjunior127@gmail.com'
    }
    const resRegister = await request(appServer)
      .post(`${routePrefix}/auth/register`)
      .set('Accept', 'application/json')
      .send(newUser)
    const resLogin = await request(appServer)
      .post(`${routePrefix}/auth/login`)
      .set('Accept', 'application/json')
      .send({ email: newUser.email, password: newUser.password })
    expect(resRegister.statusCode).toBe(201)
    expect(resRegister.body.data).toMatchObject(responseExpectedRegister)
    expect(resLogin.statusCode).toBe(200)
    expect(resLogin.body.data.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/)
    token = resLogin.body.data.token
  })
  test('should return 200 and token restoring from database', async () => {
    const resLogin = await request(appServer)
      .post(`${routePrefix}/auth/login`)
      .send({ email: 'mrjunior127@gmail.com', password: '12345' })
    expect(resLogin.body.data.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/)
    expect(resLogin.body.data.token).toContain(token)
  })
  test('should return 200 when role is admin', async () => {
    const resLogin = await request(appServer)
      .post(`${routePrefix}/auth/login`)
      .send({ email: 'admin@admin.com', password: '1234' })
    const token = resLogin.body.data.token as string
    const responsePingAdmin = await request(appServer)
      .get(`${routePrefix}/ping/admin`)
      .set('Authorization', `JWT ${token}`)
    console.log(responsePingAdmin.body)
    expect(resLogin.body.data.token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/)
    expect(responsePingAdmin.statusCode).toBe(200)
    expect(responsePingAdmin.body.message).toMatch('pong')
  })
})

afterAll(async () => {
  const mongoService = MongoService.getInstance
  await mongoService.disconnnect()
})
