<template>
  <div class="app">
    <router-link to="/demo/virtual">虚拟树</router-link>
    <router-link to="/demo/virtual-lazy">虚拟树（懒加载）</router-link>
    <Layout />
  </div>
</template>
<script>
import Layout from "./Layout.vue"

export default {
  components: {
    Layout
  }
}
</script>
<style>
.app {
  width: 800px;
  margin: 0 auto;
  margin-top: 50px;
}
</style>