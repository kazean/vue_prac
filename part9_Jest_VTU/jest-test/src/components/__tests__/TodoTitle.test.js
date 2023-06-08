import { shallowMount } from '@vue/test-utils'
import TodoTitle from '../TodoTitle'
import axios from 'axios'

describe('TodoTitle component', () => {
  let wrapper
  beforeEach(() => {
    // 모의함수 Mock 함수
    const res = {
      data: {
        title: "delectus aut autem"
      }
    }
    // axios.get = jest.fn(() => {
    //   return new Promise(resolve => {
    //     resolve(res)
    //   })
    // })
    axios.get = jest.fn().mockResolvedValue(res)
    wrapper = shallowMount(TodoTitle)
  })

  test('가져온 테스를 렌더링', () => {
    expect(wrapper.text()).toBe('delectus aut autem')
  })
})