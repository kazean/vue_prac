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
<script>
export default {
  created () {
    console.log('Router:', this.$router)
    console.log('Route:', this.$route)
  }
}
</script>
