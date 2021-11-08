<template>
  <div>
    <span>节点数：{{count}}</span>
    <v2-virtual-tree :data="data" :height="300" default-expand-all></v2-virtual-tree>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: this.createData()
    }
  },
  computed: {
    count() {
      const flat = nodes => {
        const result = [];
        if (!nodes || nodes.length === 0) return [];
        for (let node of nodes) {
          result.push(node);
          if (node.children) {
            result.push(...flat(node.children));
          }
        }
        return result;
      }
      return flat(this.data).length;
    }
  },
  methods: {
    createData (level = 4, baseKey = '') {
      if (!level) return undefined
      return Array.apply(null, { length: 10 - level }).map((_, index) => {
        const key = '' + baseKey + level + index
        return {
          label: this.createLabel(level),
          key,
          children: this.createData(level - 1, key)
        }
      })
    },
    createLabel (level) {
      if (level === 4) return '道生一'
      if (level === 3) return '一生二'
      if (level === 2) return '二生三'
      if (level === 1) return '三生万物'
    }
  }
};
</script>
