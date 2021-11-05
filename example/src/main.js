
import Vue from 'vue'
import App from './App.vue'

import V2VirtualTree from '../../src/index.js'
import '../../src/index.css'

Vue.use(V2VirtualTree)

new Vue({
  render: h => h(App)
}).$mount('#app')