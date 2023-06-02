import Vue from 'vue'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
  namespaced: true,
  state: () => ({
    db: null,
    todos: [],
    filters: 'all'
  }),
  getters: {
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
    },
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
    createDB (state, newTodo) {
      state.db
        .get('todos')
        .push(newTodo)
        .write() // lowdb
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  actions: {
    initDb ({ state, commit }) {
      const adapter = new LocalStorage('todo-app') // DB
      // state.db = lowdb(adapter)
      commit('assignDB', lowdb(adapter))

      console.log(state.db)

      const hasTodos = state.db.has('todos').value()

      if (hasTodos) {
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
    },
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
    },
    updateTodo ({ state, commit }, { todo, value }) {
      commit('updateDB', { todo, value })

      const foundTodo = _find(state.todos, { id: todo.id })
      commit('assignTodo', { foundTodo, value })
    },
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
}
