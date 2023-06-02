# Part6. Vue 프로젝트 - Local DB를 활용한 Todo List 만들기 (4)
https://github.com/HeropCode/Vue-Todo-app [완성본]

# Ch04-01. Vue-Router 개요
페이지를 관리하는 필요한 기능들의 모듈
- 중첩된 라우트/뷰 매핑
- 모듈화된, 컴포넌트 기반의 라우터 설정
- 라우터 파라미터, 쿼리, 와일드카드
- Vue.js의 트랜지션 시스템을 이용한 트랜지션 효과
- 세밀한 네비게이션 컨트롤
- active CSS 클래스를 자동으로 추가해주는 링크
- HTML5 히스토리 모드 또는 해시 모드(IE9에서 자동으로 폴백)
- 사용자 정의 가능한 스크롤 동작

# Ch04-02. Vue-Router 설치 및 기본 구성
## Vue Router 설치
```
$ npm i vue-router
# or
$ npm i vue-router@3.1.3
```
## router/index.js
```
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // config
  
]

export default new VueRouter({
  routes
})
```
> import VueRouter from 'vue-router'  
Vue.use(Vuerouter)  
const routes = [ // config ]  
export default new VueRouter({ ~ })
## main.js
```
import router from './router'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
```
> import router from './router/index.js', new Vue({ router: router })

# Ch04-03.routes 구성
## index.js
```
const routes = [
  // config
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/todos',
    component: TodoApp
  }
]

export default new VueRouter({
  routes
})
```
## views/Home, About, TodoApp.vue
> 상대경로를 절대경로 Alias 구성

# Ch04-04. Webpack 절대경로 Alias 설정
## webpack.config.js
```
module.exports = (env, opts) => {
	const config = {
		// 개발, 제품용 중복되는 옵션
		
		resolve: {
			extensions: ['.vue', '.js'],
			alias: {
				'~': path.join(__dirname),
				'scsss': path.join(__dirname, './scss')
			}
		},
    ~
  }
}
```
## TodoApp.vue, index.js  
```
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem

<style lang="scss">
  @import "scss/style"
</style>
```
```
import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'
```
## App.vue
```
<template>
  <router-view />
</template>
```
> router-view
## 기동
- http://localhost:8080/#/  
- http://localhost:8080/#/todos
> /#/ Hash/History Mode

# Ch04-05. Home, About 페이지 구성
## Home.vue
```
<template>
  <section class="home">
    <div>
      <h1>
        HEROPY's Home page!
      </h1>
      <h2 @click="$router.push('/about')">
        About
      </h2>
      <router-link 
        to="/todos"
        tag="h2">
        Todo App
      </router-link>
    </div>
  </section>
</template>
```
1. h2 @click="toAbout", methods > this.$router.push('/about')
2. h2 @click="$router.push('/about')
3. router-link to="/todos" tag="h2"
> $router.push('~') 컴포넌트 기반 페이지 이동기능
## About.vue
```
<template>
  <section class="about">
    <div>
      <h2>Yeo Geon-A</h2>
      <h2>gunna@gmail.com</h2>
      <h2>010-1234-1234</h2>
    </div>
  </section>
</template>
```

# Ch04-06. SPA(Single Page Application)의 이해
- https://my-site.com
> /, /about, /todos
- index.html
> div #app
- main.js
- App.vue
> router-view
>> Hoem.vue, About.vue, TodoApp.vue
- 현재 페이지(index.html)를 동적으로 다시 작성함으로써 사용자와 소통하는 웹 애플리케이션을 말한다

# Ch04-07. Hash_History 모드
## HTML5 히스토리 모드
`#` Hash, `/` History 모드
- !적절한 서버 설정이 없는 단일 페에지
> 문제를 해결하려면 서버에 간단하게 포괄적인 대체 경로를 추가하기만 하면됩니다. URL이 정적 에셋과 일치하지 않으면 앱이 있는 동일한 index.html페이지를 제공해야 합니다.
## 서버 설정 예제
- Apach, Nginx, Native NodeJs
## 주의 사항
이제 서버에서 404 에러를 보고하지 않을 것입니다  
모든 발견되지 않은 경로가 이제 index.html 파일을 제공 
```
const router = new VueRouter({
  mode: 'history',
  routes: [{ path: '*', component: NotFoundComponent }]
})
```
> 매칭되는 것은 보여주고, 매칭되지 않은 것만 `NotFoundCompoent`
## router/index.js
```
export default new VueRouter({
  mode: 'history',
  routes
})
```
> history 모드가 잘동작하지만 새로고침시 404

# Ch04-08. 홈으로 버튼 만들기
## App.vue
```
<template>
  <div>
    <router-link 
      to="/" 
      class="to-home">
      <i class="material-icons">home</i>
    </router-link>

    <router-view />
  </div>
</template>
<style lang="scss">
  .to-home.router-link-exact-active {
    display: none;
  }
</style>
```
> `router-link`  
class="router-link-exact-active, router-link-active"에 따라 정확한 페이지인지, 하위인지 구분되어진다

# Ch04-09. $route와 $router 객체
## App.vue
`Router`, `Route`
## index.js
```
const routes = [
  {
    name: 'index',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'todos',
    path: '/todos',
    component: TodoApp,
    children: [
      {
        name: 'todos-filter',
        path: ':id'
      }
    ]
  }
]
```

# Ch04-10. Todo filter를 params로 관리
## TodoApp.vue
```
<router-link
  to="all" 
  tag="button">
  모든 항목 ({{ total }})
</router-link>
<router-link 
  to="active"
  tag="button">
  해야 할 항목 ({{ activeCount }})
</router-link>
<router-link 
  to="completed"
  tag="button">
  완료된 항목 ({{ completedCount }})
</router-link>
</div>
```
```
computed: {
  filteredTodos() {
    switch (this.$route.params.id) {
      case 'all':
      default:
        return this.todos
      case 'active': // 해야 할 항목
        return this.todos.filter(todo => !todo.done)
      case 'completed': // 완료된 항목
        return this.todos.filter(todo => todo.done)
    }
  }
}
```
```
<style lang="scss">
  .filters button.router-link-active {
    background: royalblue;
    color: white;
  }
</style>
```
> router-link, this.$route.params.id
## router/index.js
```
const routes = [
  // config
  {
    name: 'todos',
    path: '/todos',
    redirect: 'todos/all',
    component: TodoApp,
    children: [
      {
        name: 'todos-filter',
        path: ':id'
      }
    ]
  }
]
```
> redirect
