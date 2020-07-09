<template>
  <div id="app">
    <Navbar/>
    <br>
    <br>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <div class="container">
      <Errors v-if="error" :msg="error" />
      <router-view/>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Navbar from './components/Navbar.vue'
import Errors from './components/Errors.vue'
export default {
  components: {
    Navbar,
    Errors
  },
  computed: {
    ...mapGetters(["error"])
  }
}
</script>
<style>
  .card, .btn {
    border-radius: 0px;
  }
</style>