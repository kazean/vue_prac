import { addOne } from "../calc";

describe('addOne', () => {
  beforeAll(() => {
    console.log('beforeAll')
  })
  afterAll(() => {
    console.log('afterAll')
  })
  beforeEach(() => {
    console.log('beforeEach')
  })
  afterEach(() => {
    console.log('afterEach')
  })

  test('1', () => {
    console.log('test 1')
  })

  test('2', () => {
    console.log('test 2')
  })
})