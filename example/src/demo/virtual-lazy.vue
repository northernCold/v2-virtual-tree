<template>
  <div>
    <span>节点数：{{count}}</span>
    <v2-virtual-tree ref="tree" :load="loadNode" :height="300" lazy></v2-virtual-tree>
  </div>
</template>
<script>
let id = 0;
export default {
  mounted() {
    this.$watch("$refs.tree.store.list", (val) => {
      this.count = val.length;
    })
  },
  data() {
    return {
      count: 1,
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ id: id++, label: 'region' }]);
      }
      if (node.level > 1) {
        const arr = [{
          id: id,
          label: 'leaf' + id++,
          leaf: true
        }, {
          id: id,
          label: 'zone' + id++,
        },
        {
          id: id,
          label: 'zone' + id++,
        },
        {
          id: id,
          label: 'zone' + id++,
        },
        {
          id: id,
          label: 'zone' + id++,
        }]
        return resolve(arr);
      }
      // setTimeout(() => {
        const data = [{
          id: id,
          label: 'leaf' + id++,
          leaf: true
        }, {
          id: id,
          label: 'zone' + id++
        }];

        resolve(data);
      // }, 500);
    }
  }
}
</script>
