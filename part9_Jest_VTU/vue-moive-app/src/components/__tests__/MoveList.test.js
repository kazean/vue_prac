import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from 'vuetify'
import MovieList from '../MovieList'

const localVue = createLocalVue()
localVue.use(Vuetify)

describe('MovieList Component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MovieList, {
      localVue,
      mocks: {
        $store: {
          state: {
            movie: {
              movies: [
                {
                  imdbID: '123456',
                  Title: '영화 제목',
                  Poster: 'image.jpg',
                  Year: '2020'
                }
              ]
            }
          }
        }
      }
    })
  })

  test('영화 제목 출력', () => {
    // console.log(wrapper.html())
    expect(wrapper.find('v-card-title-stub').text()).toBe('영화 제목')
  })
  
  test('개봉 연도 출력', () => {
    expect(wrapper.find('v-card-subtitle-stub').text()).toBe('2020')
  })

  test('이미지 경로가 있는 경우', () => {
    const img = wrapper.find('v-img-stub')
    expect(img.attributes('src')).toBe('image.jpg')
    expect(img.attributes('height')).toBe('300')
  })

  test('이미지 경로가 없는 경우', () => {
    wrapper = shallowMount(MovieList, {
      localVue,
      mocks: {
        $store: {
          state: {
            movie: {
              movies: [
                {
                  imdbID: '123456',
                  Title: '영화 제목',
                  Poster: 'N/A',
                  Year: '2020'
                }
              ]
            }
          }
        }
      }
    })
    const img = wrapper.find('v-img-stub')
    expect(img.attributes('src')).toBe('')
    expect(img.attributes('height')).toBe('100')
  })
})