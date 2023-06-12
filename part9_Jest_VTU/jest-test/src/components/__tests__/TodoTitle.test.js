import { shallowMount } from '@vue/test-utils'
import TodoTitle from '../TodoTitle'
import axios from 'axios'

jest.mock('axios')

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
    // axios.get = jest.fn().mockResolvedValue(res)
    axios.get.mockResolvedValue(res)
    wrapper = shallowMount(TodoTitle)
  })

  test('가져온 테스를 렌더링', () => {
    expect(wrapper.text()).toBe('delectus aut autem')
  })

  test('호출 여부', () => {
    // expect(axios.get).toHaveBeenCalledTimes(2)
    const spy = jest.spyOn(wrapper.vm, 'fetchTodo')
    wrapper.vm.fetchTodo()
    expect(wrapper.vm.fetchTodo).toHaveBeenCalled()
  })

})