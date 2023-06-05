# Part8. Vue 프로젝트 - 영화 API를 활용한 검색페이지 만들기
https://github.com/HeropCode/Vue-Movie-app  
Vue CLI를 통해서 손쉽고 빠르게 개발 환경을 구성

# Ch04-01.영화 검색 예제 소개
## Vue CLI
## Vue UI
## Vuex
## Vuetify
Vuetify는 Material Design 사양을 기준으로 웹앱 구축에 필요한 다양한 기능을 제공합니다.  
특히 UI components를 사용해 손쉽고 빠르게 프로젝트의 UI를 구성할 수 있습니다.
## OMDb API
http://www.omdbapi.com/  
OMDb API는 영화 정보를 얻기 위한 RESTful 웹 서비스입니다.  
무료로 API키를 발급받아(하루 1000건 제한) 사용할 수 있습니다.  
## Axios
https://github.com/axios/axios  

Axios는 HTTP 클라이언트 라이브러리로써, OMDb API를 통해 영화 정보(비동기 HTTP 데이터)를 요청하기 위해 사용합니다.  
이 예제에서는 비동기 방식에 대한 이해가 매우 중요합니
## Masonry(for vue)
https://github.com/shershen08/vue-masonry#readme  

검색된 영화 목록을 핀터레스트 스타일의 레이아웃으로 구성하기 위해 사용합니다.  
vue-masonry는 Masonry 라이브러리를 Vue.js로 랩핑한 모듈입니다.
## Firebase Hosting

# Ch04-02. Vue CLI 설치 및 프로젝트 생성
## Vue CLI 설치
```
$ npm i @vue/cli@4.1.2 -g
```
```
$ vue --version
# @vue/cli 4.1.2
```
## Vue CLI를 통한 프로젝트 만들기
```
$ vue create vue-movie-app
```
> `$ vue create <project>`

# Ch04-03. Vue UI
## vue-moive-app
- public
- src
- package.json
## Vue UI
```
$ vue ui
```
> `$ vue ui`
- 프로젝트 가져오기
- 의존성
- 작업목록

# Ch04-04. 플러그인으로 Vuetify 설치
- vue ui
> `플러그인 > vue-cli-plugin-vuetify`
- package.json, src/plugins, main.js 등
> vuetify 자동 추가

# Ch04-05. 플러그인으로 Vuex 설치
- `플러그인 > vuex 추가 버튼`
- `main.js import './store'`
## main.js
```
import store from './store'
```
package.json

# Ch04-06. 컴포넌트 구조 설정
- Vuetify는 전역적으로 import, `Vuetify plugin`  
- 따로 import 할 필요없고 vuetify를 사용하는 `<v-app>` tag설정
## App.vue
```
<template>
  <v-app>
    <v-container>
      <search-bar />
      <movie-list />
    </v-container>
  </v-app>
</template>

<script>
import SearchBar from '@/components/SearchBar'
import MovieList from '@/components/MovieList'

export default {
  components: {
    SearchBar,
    MovieList
  }
}
</script>
```
> `@` 기본 HomePath
## components/SearchBar.vue, MovieList.vue 생성

# Ch04-07. 검색바 컴포넌트 만들기
## SearchBar.vue
```
<template>
  <div>
    <v-text-field
      v-model="title"
      outlined
      @keypress.enter="searchMovies">
      <template v-slot:prepend-inner>
        <v-icon>search</v-icon>
      </template>
      <template v-slot:append>
        <v-progress-circular
          v-if="loading"
          size="24"
          color="primary"
          indeterminate />
      </template>
    </v-text-field>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      loading: false
    }
  },
  methods: {
    searchMovies () {
      console.log('search Movies')
    }
  }
}
</script>
```
> `v-text-field`, `v-icon`, `v-progress-circular`
no-console에러시 package.json > eslintConfig > rules > "no-console": "off"

# Ch04-08. OMDb API
# Ch04-09. axios 설치 및 영화 검색 요청
Promise based HTTP client for the browser and node.js
## axios 설치
vue ui > 의존성 > axios
## SearchBar.vue
```
import axios from 'axios'

methods: {
  searchMovies () {
    console.log('search Movies')
    axios.get(`https://www.omdbapi.com/?apikey=${this.apiKey}&s=${this.title}`)
      .then(res => {
        console.log(res)
      }) 
  }
}
```
> `axios.get(url).then(res => {})`

# Ch04-10. 동기와 비동기 처리의 이해
# Ch04-11. Promise와 Async Await 사용 패턴
## async.js
## Promise func, then(), catch()
## async await, try ~ catch ~ finally

# Ch04-12. Network Throttling
## SearchBar.vue
```
methods: {
  async searchMovies () {
    this.loading = true
    const res = await axios.get(`https://www.omdbapi.com/?apikey=${this.apiKey}&s=${this.title}`)
    console.log(res.data)
    this.loading = false
  }
}
```
## Network Throttling
Chrome > Network > Throttling

# Ch04-13. 스토어로 이관하기
- store/index.js, store/movie.js
- index.js: import, moduels, movie.js: namespaced, state, getters, mutations, actions
## 두 개 이상 Depth 데이터 이동, 이벤트 버스/스토어
## store/index.js
```
import Vue from 'vue'
import Vuex from 'vuex'
import movie from './movie'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    movie
  }
})

```
## store/movie.js
```
import axios from 'axios'

const API_KEY = '<key>'

export default {
  namespaced: true,
  state: () => ({
    title: '',
    movies: [],
    loading: false
  }),
  mutations: {
    updateState (state, payload) {
      Object
        .keys(payload)
        .forEach(key => {
          state[key] = payload[key]
        })
    }
  },
  actions: {
    async searchMovies ({ state, commit }) {
      // state.loading = true
      commit('updateState', {
        loading: true
      })
      const res = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${state.title}`)
      console.log(res.data)
      // state.movies = res.data.Search
      // state.loading = false
      commit('updateState', {
        movies: res.data.Search,
        loading: false
      })
    }
  }
}
```
> SearchBar.searchMovies  
updateState: state Update 범용 Method
## SearchBar.vue
```
import { mapActions } from 'vuex'

export default {
  name: 'SearchBar',
  computed: {
    title: {
      get () {
        return this.$store.state.movie.title
      },
      set (title) {
        this.$store.commit('movie/updateState', {
          title
        })
      }
    },
    loading () {
      return this.$store.state.movie.loading
    }
  },
  methods: {
    ...mapActions('movie', [
      'searchMovies'
    ])
  }
}
```
> title: get/set()

# Ch04-14. 영화 목록 출력하기
## MovieList.vue
```
<template>
  <v-row>
    <v-col v-for="movie in movies"
      :key="movie.imdbID"
      cols="12"
      lg="3"
      md="3"
      sm="6">
      <div>{{ movie.Title }}</div>
      <div>{{ movie.Year }}</div>
      <div>{{ movie.Poster }}</div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  computed: {
    movies () {
      return this.$store.state.movie.movies
    }
  }
}
</script>
```
> Vuetify, v-row, v-col

# Ch04-15. 영화 카드 꾸미기
## Masonry vue [메인 의존성]
왜 개발용으로만 설치...? 
- 의존성: vue-masonry
- plugins/vue-masonry.js: import { VueMasonryPlugin }, Vue.ues(VueMasonryPlugin)
- main.js: import './plugins/vue-masonry'
- MovieList.vue: v-masonry, item-selector / v-masonry-tile, class
## plugins/vue-masonry.js
```
import Vue from 'vue'
import { VueMasonryPlugin } from 'vue-masonry'

Vue.use(VueMasonryPlugin)
```
## main.js
```
import vuetify from './plugins/vuetify'
import './plugins/vue-masonry'
```
## MovieList.vue
```
<template>
  <v-row
    v-masonry
    item-selector=".item">
    <v-col 
      v-for="movie in movies"
      :key="movie.imdbID"
      v-masonry-tile
      class="item"
      cols="12"
      lg="3"
      md="3"
      sm="6">
      <v-card>
        <v-img 
          :src="movie.Poster"
          :alt="movie.Title"
          height="300"></v-img>
        <v-card-title>
          {{ movie.Title }}
        </v-card-title>
        <v-card-subtitle>
          {{ movie.Year }}
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  computed: {
    movies () {
      return this.$store.state.movie.movies
    }
  }
}
</script>
```
> v-row: v-masonry, item-selector  
v-col: v-masonry-tile, class  
v-img: hegiht
>> masonry가 먼저 적용된 후 이미지 랜더링이 되기 때문에 height 적용

# Ch04-16.최대 40개까지 검색 결과 요청하기
리팩토리 async fetchMovies ({ state, commit }, pageNum)
## movie.js
```
mutations: {
  updateState (state, payload) {
    Object
      .keys(payload)
      .forEach(key => {
        state[key] = payload[key]
      })
  },
  pushIntoMovies (state, movies) {
    state.movies.push(...movies)
  }
},
actions: {
  async fetchMovies ({ state, commit }, pageNum) {
    const res = await new Promise(resolve => {
      const innerRes = axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${state.title}&page=${pageNum}`)
      resolve(innerRes)
    }).then()
    commit('pushIntoMovies', res.data.Search)
    return res.data
  },
  async searchMovies ({ commit, dispatch }) {
    commit('updateState', {
      loading: true,
      movies: []
    })
    const { totalResults } = await dispatch('fetchMovies', 1)
    const pageLength = Math.ceil(totalResults / 10)

    if(pageLength > 1) {
      for (let i = 2; i <= pageLength; i += 1) {
        if(i > 4 ) break
        await dispatch('fetchMovies', i)
      }
    }
    commit('updateState', {
      loading: false
    })
  }
}
```
> actions fetchMovies({ state, commit }, pageNum): axiois.get  
mutations pushIntoMovies(state, movies): state.movie.push(...movies)

# Ch04-17. 영화 포스트가 없는 경우
## MovieList.vue
```
<v-img 
  :src="posterSrc(movie.Poster)"
  :alt="movie.Title"
  :height="posterHeight(movie.Poster)">
  <template v-slot:placeholder>
    <div style="background: lightgray; height: 100%"></div>
  </template>
</v-img>
```
> template v-slot:placeholder, 위 이미지가 없을 경우 default
```
methods: {
  posterSrc (poster) {
    return poster === 'N/A' ? '' : poster
  },
  posterHeight (poster) {
    return poster === 'N/A' ? 100 : 300
  }
}
```

# Ch04-18. Firebase 호스팅
## Firebase CLI 설치
```
$ npm install -g firebase-tools
# or
$ npm install -g firebase-tools@7.12.1
$ firebase login
$ firebase init
$ firebase deploy
```