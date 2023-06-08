import { shallowMount } from "@vue/test-utils";
import Message from '../Message'

describe('Message Component', () => {
  test('1', () => {
    const wrapper = shallowMount(Message)
    const wrapperArray = wrapper.findAll('div > *')

    expect(wrapperArray.length).toBe(3)
    expect(wrapperArray.at(1).text()).toBe('2')
  })
})