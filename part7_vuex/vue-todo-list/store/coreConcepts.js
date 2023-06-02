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
    someAction1 ({ state, getters, commit, dispatch }, payload) {
      commit('someMutation', payload)
    },
    someAction2 (context, payload) {
      context.commit('someMutation')
      context.dispatch('someAction1', payload)
    }
  }
}
