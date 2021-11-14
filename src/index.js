import V2VirtualTree from './components/tree/index.vue'

const install = (Vue) => {
  Vue.component('v2-virtual-tree', V2VirtualTree)
}

export {
  V2VirtualTree
}

export default {
  install,
}