# Part4. Vue 프로젝트 - Local DB를 활용한 Todo List 만들기(2)
https://github.com/HeropCode/Vue-Todo-app [완성본]

# ch04-01. 각 컴포넌트 구성 이해하기
TodoApp, TodoItem, TodoCreator  
> App.vue


# ch04-02. 각 컴포넌트 생성 및 연결
## Vue 컴포넌트 트리
- App.vue
```
<template>
  <todo-app />
</template>
<script>
import TodoApp from './components/TodoApp'

export default {
  components: {
    // 'todo-App': TodoApp
    TodoApp
  }
}
</script>
```
> App.vue에 TodoApp 연결
- TodoApp.vue
```
<template>
  <div>
    <todo-item />
    <todo-creator />
  </div>
</template>

<script>
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  }
}
</script>
```
> TodoApp에 TodoItem, TodoCreator 연결  
template 태그는 자식을 하나만 가질 수 있으므로 div 태그안에 컴포넌트 태그 작성
- TodoCreator.vue
```
<template>
  <h1>Todo Creator</h1>
</template>
```
- TodoItem.vue
```
<template>
  <h2>Todo item</h2>
</template>
```


# ch04-03. Local DB 초기화 - LocalStorage
browser LocalStorage
# ch04-04. Local DB 초기화 - Lowdb와 Lodash 설치 및 DB 초기화
## Lowdb
localstorage 간편 사용 기능 포함, lodash 라이브러리 사용
### 설치
```
$ npm i lodash lowdb 
# or
$ npm i lodash@4.17.15 lowdb@1.0.0
```
### 사용하기 - TodoApp.vue
```
<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  data () {
    return {
      db: null
    }
  },
  created () {
    this.initDb()
  },
  methods: {
    initDb () {
      const adapter = new LocalStorage('todo-app') // DB
      this.db = lowdb(adapter)

      // Local DB 초기화
      this.db
        .defaults({
          todos: [] // Collection
        })
        .write()
    }
  }
}
</script>
```
> node import 먼저 후 컴포넌트 import (구분하는 것이 좋다)  
DB 선언, 초기화 메소드, created 라이프사이클(컴포넌트 생성시)에 초기화 메소드 실행


# ch04.05. Local DB 초기화 - Lowdb와 Lodash 기본 사용법
## lowdb
### Classess
- new Low(adapter)
### API
- db.read(), write()
## lodash
### API
- defaults
```
_.defaults(object, [sources])
_.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
// => { 'a': 1, 'b': 2 }
```
> 첫번째 인자에 그 뒤에 인자들을 병합함
- filter, take() ...

# ch04-06. CRUD 이해하기
# ch04-07. CRUD - Create Todo
## cryto-random-string
### install
```
$ npm install crypto-random-string
# or
$ npm install crypto-random-string@3.0.1
```

- TodoApp.vue
```
import cryptoRandomString from 'crypto-random-string'

createTodo (title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title, 
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      // get, push > lodash
      this.db
        .get('todos')
        .push(newTodo)
        .write() // lowdb
    }
```


# ch04-08. TodoCreator 컴포넌트 만들기
## TodoCreator.vue
```
<template>
  <div>
    <button @click="createTodo">추가</button>
    <input 
      :value="title"
      :placeholder="placeholder"
      type="text"
      @input="title = $event.target.value"
      @keypress.enter="createTodo"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      placeholder: '할 일을 추가하세요!'
    }
  },
  methods: {
    createTodo () {
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목 입니다!')
        this.title = this.title.trim()
        return
      }
      
      this.$emit('create-todo', this.title)
      this.title = ''
    }
  }
}
</script>
```
> input 속성 순서(표준), $emit('event', param)
## TodoApp.vue
```
<template>
  <div>
    <todo-item />
    <todo-creator @create-todo="createTodo" />
  </div>
</template>
```
> @create-todo="createTodo"


# ch04-09. CRUD - Read Todos
- TodoApp
```
<template>
  <div>
    <todo-item 
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @update-todo="updateTodo"
      @delete-todo="deleteTodo"
    />
    <hr />
    <todo-creator @create-todo="createTodo" />
  </div>
</template>
<script>
  data () {
    return {
      db: null,
      todos: []
    }
  },
  ~
    initDb () {
      const adapter = new LocalStorage('todo-app') // DB
      this.db = lowdb(adapter)
      const hasTodos = this.db.has('todos').value()

      if(hasTodos) {
        // this.todos = this.db.getState().todos // 참조 관계가 그대로 유지
        this.todos = _cloneDeep(this.db.getState().todos)
      } else {
        // Local DB 초기화
        this.db
          .defaults({
            todos: [] // Collection
          })
          .write()
      }
    },
    updateTodo () {
      console.log('Update Todo!')
    },
    deleteTodo () {
      console.log('Delete Todo!')
    }
</script>
```
> data: todos DB 복제본, this.todos = _cloneDeep(this.db.getState().todos)  
:todo="todo" Props
- TodoItem.vue
```
<template>
  <div class="todo-item">
    <input 
      v-model="done"
      type="checkbox"
    >
    <div class="item__title-wrap">
      <div class="item__title">
        {{ todo.title }}
      </div>
      <div class="item__date">
        {{ date }}
      </div>
    </div>
    <div class="item__actions">
      <button @click="onEditMode">수정</button>
      <button @click="deleteTodo">삭제</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    todo: Object
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      set (done) {
        this.updateTodo({
          done
        })
      }
    }
  },
  methods: {
    onEditMode () {

    },
    updateTodo (value) {
      this.$emit('update-todo', this.todo, value)
    },
    deleteTodo () {
      this.$emit('delete-todo', this.todo)
    }
  }
}
</script>
```
> computed get/set()


# ch04-10. TodoItem 컴포넌트 만들기 - 출력모드
## moment.js, day.js > dayjs
### 설치
```
$ npm i dayjs
# or 
$ npm i dayjs@1.8.18
```
### TodoItem.vue
```
import dayjs from 'dayjs'
~
    date () {
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt)

      if (isSame) {
        return date.format('YYYY년 MM월 DD일')
      } else {
        return `${date.format('YYYY년 MM월 DD일')} (edited)`
      }
    }
```


# ch04-11. TodoItem 컴포넌트 만들기 - 수정모드
## TodoItem.vue
```
<template>
  <div class="todo-item">
    <div 
      v-if="isEditMode"
      class="item__inner item--edit"
    >
      <input
        ref="titleInput"
        :value="editedTitle"
        type="text"
        @input="editedTitle = $event.target.value"
        @keypress.enter="editedTodo"
        @keypress.esc="offEditMode"
      >
      <div class="item__actions">
        <button 
          key="complete"
          @click="editedTodo">완료</button>
        <button 
          key="cancel"
          @click="offEditMode">취소</button>
      </div>
    </div>
    <div 
      v-else
      class="item__inner item--normal"
    >
      ~
      <div class="item__actions">
        <button 
          key="update"
          @click="onEditMode">수정</button>
        <button 
          key="delete"
          @click="deleteTodo">삭제</button>
      </div>
    </div>
  </div>
</template>
```
```
<script>
    ~
  data () {
    return {
      isEditMode: false,
      editedTitle: ''
    }
  },
  methods: {
    editedTodo () {
      if (this.todo.title !== this.editedTitle) {
        this.updateTodo({
          title: this.editedTitle,
          updatedAt: new Date()
        })
      }

      this.offEditMode()
    },
    onEditMode () {
      this.isEditMode = true
      this.editedTitle = this.todo.title

      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    offEditMode () {
      this.isEditMode = false
    },
  }
</script>
```
> div v-if, v-else  
buttom key="", vue에서는 양식(button)요소가 같으면 렌더링하지 않는다, 그래서 key로 구분지어줘야함  
this.$nextTock(callback) 렌더링 후 콜백함수  
this.$refs


# ch04-12. CRUD - Update Todo
## TodoApp.vue
```
import _find from 'lodash/find'
import _assign from 'lodash/assign'

  ~
    createTodo (title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title, 
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      // Create DB
      // get, push > lodash
      this.db
        .get('todos')
        .push(newTodo)
        .write() // lowdb

      // Create Client
      this.todos.push(newTodo)
    },
    updateTodo (todo, value) {
      this.db
        .get('todos')
        .find({ id: todo.id})
        .assign(value)
        .write()
      
      const found_todo = _find(this.todos, { id: todo.id })
      // Object.assgin(found_todo, value)
      _assign(found_todo, value)
    },
```
> lodash find/assign()  
todos, db 동시 갱신


# ch04-13. CRUD - Delete Todo
## TodoApp.vue
```
import _findIndex from 'lodash/findIndex'
~
    deleteTodo (todo) {
      this.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
      
      // _remove(this.todos, { id: todo.id }) // 반응성 X
      const foundIndex = _findIndex(this.todos, { id: todo.id })
      this.$delete(this.todos, foundIndex)
    }
```
> _.findIndex(array, [predicate=_.identity], [fromIndex=0]) (lodash)  
vm.$delete( target, propertyName/index )


# ch04-14. TodoItem 컴포넌트 만들기 - 간단한 스타일 추가
## TodoItem.vue
```
<template>
  <div 
    :class="{ done }"
    class="todo-item"
  >
  ~
</template>
<style scoped lang="scss">
  .todo-item {
    margin-bottom: 10px;
    .item__inner {
      display: flex; // 자식 수평 정렬
    }
    .item__date {
      font-size: 12px;
    }
    &.done {
      .item__title {
        text-decoration: line-through;
      }
    }
  }
</style>
```
> scss 중첩 클래스 `&`기호


# ch04-15. Todo Filters 만들기
## TodoApp.vue
```
<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
        <button 
          :class="{ active: filter === 'all' }"
          @click="changeFilter('all')">
          모든 항목 ({{ total }})
        </button>
        <button 
          :class="{ active: filter === 'active' }"
          @click="changeFilter('active')">
          해야 할 항목 ({{ activeCount }})
        </button>
        <button 
          :class="{ active: filter === 'completed' }"
          @click="changeFilter('completed')">
          완료된 항목 ({{ completedCount }})
        </button>
      </div>
    </div>
    ~
</template>
```
```
<script>
  ~
  data () {
    return {
      db: null,
      todos: [],
      filter: 'all'
    }
  },
  computed: {
    filteredTodos() {
      switch (this.filter) {
        case 'all':
        default:
          return this.todos
        case 'active': // 해야 할 항목
          return this.todos.filter(todo => !todo.done)
        case 'completed': // 완료된 항목
          return this.todos.filter(todo => todo.done)
      }
    },
    total () {
      return this.todos.length
    },
    activeCount () {
      return this.todos.filter(todo => !todo.done).length
    },
    completedCount () {
      return this.total - this.activeCount
    }
  },
  methods: {
    changeFilter (filter) {
      this.filter = filter
    }
  }
</script>
<style scoped lang="scss">
  button.active {
    font-weight: bold;
  }
</style>
```


# ch04-16. 전체 항목 선택 및 해제
# ch04-17. 완료 항목의 일괄 삭제
## TodoApp.vue
```
      <div class="actions">
        <input 
          v-model="allDone"
          type="checkbox">
        <button @click="clearCompleted">
          완료된 항목 삭제
        </button>
      </div>
```
```
import _forEachRight from 'lodash/forEachRight'

computed: {
  allDone: {
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
    }
},
methods: {
  clearCompleted () {
      // this.todos.forEach(todo => {
      //   if (todo.done) {
      //     this.deleteTodo(todo)
      //   }
      // })

      // this.todos
      //   .reduce((list, todo, index) => {
      //     if (todo.done) {
      //       list.push(index)
      //     }
      //     return list
      //   }, [])
      //   .reverse()
      //   .forEach(index => {
      //     this.deleteTodo(this.todos[index])
      //   })
      
      _forEachRight(this.todos, todo => {
        if (todo.done) {
          this.deleteTodo(todo)
        }
      })
    }
}
```