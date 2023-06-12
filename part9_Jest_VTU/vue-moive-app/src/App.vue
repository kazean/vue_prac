<template>
  <v-app>
    <v-container>
      <search-bar />
      <error-message />
      <movie-list />
    </v-container>
  </v-app>
</template>

<script>
import SearchBar from '@/components/SearchBar'
import MovieList from '@/components/MovieList'
import ErrorMessage from './components/ErrorMessage.vue'

export default {
  components: {
    SearchBar,
    MovieList,
    ErrorMessage
  }
}
</script>
