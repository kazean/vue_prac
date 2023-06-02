# Part7. Vue 프로젝트 - Local DB를 활용한 Todo List 만들기(5)
https://github.com/HeropCode/Vue-Todo-app [완성본]
# Ch04-01. Vuex란
## Vuex
중앙 집중화된 저장소, 그것을 관리해주는 상태관리 패턴, 모듈
## 스토어(Store)
스토어를 통해서 데이터를 주고 받으며, 데이터를 전달(부모-자식간 컴포넌트에서 데이터를 전달)하는 과정을 생략할 수 있다
- 분기처리 가능

# Ch04-02. Vuex 설치
```
$ npm i vuex
# or
$ npm i vuex@3.1.2
```
> npm audit fix, npm audit
```
$ npm audit
$ npm audit fix
```
## store/index.js
```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production'
})
```
## main.js
```
import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

```
## Strict 모드, 개발 vs 배포
```
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

# Ch04-03. Vuex 핵심 컨셉 개요
## 상태
strict, state, getters, mutations, actions, modules
## store/index.js
```
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  // Data
  state: {

  },
  // Computed
  getters: {

  },
  // Methods
  // 실제 값을 변경할 때(비동기 X)
  mutations: {

  },
  // Methods
  // 일반 로직(비동기 O)
  actions: {

  }
})
```
> strict, state, getter, mutations, actions
## mutations, actions
> mutations는 state를 변경할 수 있지만 비동기 처리가 안되고  
actions는  state를 변경할 수 없고, 비동기 처리가 가능, 데이터 변경시 mutations의 도움을 받아야 한다.
## modules
데이터 분기처리
### 네임스페이스
기본적으로 모듈 내의 액션, 변이 및 getters는 여전히 전역 네임 스페이스 아래에 등록됩니다. 여러 모듈이 동일한 변이/액션 유형에 반응 할 수 있습니다.  
만약 모듈이 독립적이거나 재사용되기를 원한다면, namespaced: true라고 네임스페이스에 명시하면 됩니다.
### todoApp.js
```
export default {
  namespaced: true,
  state: () => ({
    
  }),
  getters: {},
  mutations: {},
  actions: {}
}
```
> `namespaced`, `state`(data)는 함수여야 한다 
### /store/index.js
```
import todoApp from './todoApp'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    todoApp
  }
})
```
> modeuls에 todoApp.js 분기 연결하기

# Ch04-04. 스토어로 이관하기1
## TodoApp.vue
data(db, totos), computed(total, activeCount, completedCount), method(initDb) 이관

## todoApp.js
```
export default {
  namespaced: true,
  state: () => ({
    db: null,
    todos: [],
  }),
  getters: {
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  mutations: {
    assignDB (state, db) {
      state.db = db 
    },
    assignTodos (state, todos) {
      state.todos = todos
    }
  },
  actions: {
    initDb ({ state, commit }) {
      const adapter = new LocalStorage('todo-app') // DB
      // state.db = lowdb(adapter)
      commit('assignDB', lowdb(adapter))

      console.log(state.db)

      const hasTodos = state.db.has('todos').value()

      if(hasTodos) {
        // state.todos = _cloneDeep(state.db.getState().todos)
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
      } else {
        // Local DB 초기화
        state.db
          .defaults({
            todos: [] // Collection
          })
          .write()
      }
    }
  }
}
```
- state, getters, mutations, actions  
- getter
> total(state): method(state, getters)  
- mutations
> assignDB (state, db): method(state)
- actions
> initDb({state, commit}): method({state, commit})  
{ state } > context
commit('method', arg)

# Ch04-05. 각 옵션의 참조 관계와 인수
## store/coreConcepts.js
```
export default {
  namespaced: true,
  // Data
  state: () => ({
    a: 123,
    b: []
  }),
  // Computed
  getters: {
    someGetter1 (state, getters) {
      return state.a + 1
    },
    someGetter2 (state, getters) {
      return state.a + getters.someGetter1
    }
  },
  mutations: {
    someMutation (state, payload) {
      state.a = 789
      state.b.push(payload)
    }
  },
  actions: {
    someAction1 ({ state, getters, commit, dispatch}, payload) {
      commit('someMutation', payload)
    },
    someAction2 (context, payload) {
      context.commit('someMutation')
      context.dispatch('someAction1', payload)
    }
  }
}
```

# Ch04-06. 스토어로 이관하기2
## TodoApp.vue
createTodo

## todoApp.js
```
  mutations: {
    assignDB (state, db) {
      state.db = db 
    },
    createDB (state, newTodo) {
      state.db
      .get('todos')
      .push(newTodo)
      .write() // lowdb
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    }
  },
  actions: {
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title, 
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }
  
      // Create DB
      // get, push > lodash
      commit('createDB', newTodo)
  
      // Create Client
      commit('pushTodo', newTodo)
     
    }
  }
```

# Ch04-07. 스토어로 이관하기3 - payload
## TodoApp.vue
updateTodo
## todoApp.js
```
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'

mutations: {
  assignTodo (state, { foundTodo, value }) {
    _assign(foundTodo, value)
  }
},
actions: {
  updateTodo ({ state, commit }, { todo, value }) {
    commit('updateDB', { todo, value })
    
    const foundTodo = _find(state.todos, { id: todo.id })
    commit('assignTodo',{ foundTodo, value })
  }
}
```
> `commit('<methodName>', payload)`, 세번째 인자로 전달 불가능 > 객체로 전달한다  
import 이관

# Ch04-08. 스토어로 이관하기4
## TodoApp.vue
deleteTodo, completeAll, clearCompleted
## todoApp.js
```
mutations: {
  deleteDB (state, todo) {
    state.db
      .get('todos')
      .remove({ id: todo.id })
      .write()
  },
  deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
  },
  updateTodo (state, { todo, key, value }) {
    todo[key] = value
  }
},
actions: {
  deleteTodo ({ state, commit }, todo) {
    // Delete DB
    commit('deleteDB', todo)
    
    // _remove(this.todos, { id: todo.id }) // 반응성 X
    const foundIndex = _findIndex(state.todos, { id: todo.id })
    // Delete Client
    commit('deleteTodo', foundIndex)
  },
  completeAll ({ state, commit }, checked) {
    // DB commit은 반환값을 만들 수 없다
    const newTodos = state.db
      .get('todos')
      .forEach(todo => {
        // todo.done = checked
        commit('updateTodo', {
          todo,
          key: 'done',
          value: checked
        })
      })
      .write()

    // state.todos = _cloneDeep(newTodos)
    commit('assignTodos', _cloneDeep(newTodos))
  },
  clearCompleted ({ state, dispatch }) {
    _forEachRight(state.todos, todo => {
      if (todo.done) {
        // this.deleteTodo(todo)
        dispatch('deleteTodo', todo)
      }
    })
  }
}
```

# Ch04-09. 하위 컴포넌트에서 직접 액션 호출하기
## TodoApp.vue
```
  <div class="todo-app__list">
      <todo-item 
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
      />
    </div>
    <todo-creator 
      class="todo-app__creator"
    />
  </div>
```
> event 하위에서 자체 처리위해 @삭제
## TodoCreator.vue
```
methods: {
    createTodo () {
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목 입니다!')
        this.title = this.title.trim()
        return
      }
      
      // this.$emit('create-todo', this.title)
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''

      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
  }
```
> this.$store.dispatch('todoApp/createTodo', this.title)  
## TodoItem.vue
```
updateTodo (value) {
  // this.$emit('update-todo', this.todo, value)
  this.$store.dispatch('todoApp/updateTodo', {
    todo: this.todo,
    value
  })
},
deleteTodo () {
  // this.$emit('delete-todo', this.todo)
  this.$store.dispatch('todoApp/deleteTodo', this.todo)
}
```
> this.$store.dispatch('todoApp/updateTodo', { ~ })  
this.$store.dispatch('todoApp/deleteTodo', this.todo)

# Ch04-10. Helpers(Mapping) - State, Getters
## TodoApp.vue
```
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState('todoApp', [
      'todos'
    ]),
    ...mapGetters('todoApp', [
      'total',
      'activeCount',
      'completedCount'
    ]),
  }
}
```
> Helpers[mapState, mapGetters], computed  
todoApp.js[state, getters] > TodoApp.vue [computed]로 이관

# Ch04-11. Helpers(Mapping) - Mutations, Actions
## TodoApp.vue
```
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

methods: {
  ...mapActions('todoApp', [
      'initDb',
      'completedAll',
      'clearcompleted'
    ])
}
```
> Helpers[mapMutations, mapActions], methods
todoApp.js[mutations, actions] > TodoApp.vue [methods]로 이관
## cf, store/index.js에서 actions 가져오기
```
...mapActions([
      'testFunction'
    ]),
```

# Ch04-12. 스토어로 이관하기5
## TodoApp.vue
filteredTodos 이관
```
computed: {
  ...mapGetters('todoApp', [
    'filteredTodos',
},
watch: {
  $route () {
    // state.filter = this.$route.params.id
    // this.$store.commit('todoApp/updateFilter', this.$route.params.id)
    this.updateFilter(this.$route.params.id)
  }
},
methods: {
  ...mapMutations('todoApp', [
    'updateFilter'
  ]),
}
```
> computed filteredTodos 이관후 가져오기  
state.filter 변경감지 $route

## TodoApp.js
```
state: () => ({
  filter: 'all'
}),
getter: {
  filteredTodos (state) {
    switch (state.filter) {
      case 'all':
      default:
        return state.todos
      case 'active': // 해야 할 항목
        return state.todos.filter(todo => !todo.done)
      case 'completed': // 완료된 항목
        return state.todos.filter(todo => todo.done)
    }
  }
},
mutations: {
  updateFilter (state, filter) {
    state.filter = filter
  }
}
```

# Ch04-13. Linting
```
$ npm run lint
$ npm run lint:fix
```
# Ch04-14. Netlify
GitHub과 Netlify를 이용한 쉽고 빠른 HTTPS 무료 호스팅
```
$ npm run build
```
> Site > Upload