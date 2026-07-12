import { afterAll, beforeAll, expect, test } from 'vitest'

let db

beforeAll(async () => {
  db = await connectToDatabase()
})

afterAll(async () => {
  await db.close()
})

test('can query users', async () => {
  const users = await db.query('SELECT * FROM users')
  expect(users.length).toBeGreaterThan(0)
})

test('can query products', async () => {
  const products = await db.query('SELECT * FROM products')
  expect(products.length).toBeGreaterThan(0)
})




import { afterAll, beforeAll, expect, test } from 'vitest'

let db

beforeAll(async () => {
  db = await connectToDatabase()
})

afterAll(async () => {
  await db.close()
})

test('can query users', async () => {
  const users = await db.query('SELECT * FROM users')
  expect(users.length).toBeGreaterThan(0)
})

test('can query products', async () => {
  const products = await db.query('SELECT * FROM products')
  expect(products.length).toBeGreaterThan(0)
})