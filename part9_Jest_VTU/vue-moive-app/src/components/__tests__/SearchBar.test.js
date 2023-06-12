import { mount, createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from 'vuetify'
import store from '@/store'
import SearchBar from '../SearchBar'

const localVue = createLocalVue()
// localVue.use(Vuetify)

describe('SearchBar Component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(SearchBar, {
      localVue,
      vuetify: new Vuetify(),
      store
    })
  })

  test('제목을 입력했을 때 스토어 업데이트', () => {
    wrapper.vm.title = 'lion'
    expect(wrapper.vm.title).toBe('lion')
  })
  
  test('로딩 중 아이콘 확인', async () => {
    // class="v-progress-circular v-progress-circular--visible v-progress-circular--indeterminate primary--text"
    wrapper.vm.$store.commit('movie/updateState', {
      loading: true
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })
})