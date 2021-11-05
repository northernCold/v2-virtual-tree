<template>
  <div>
    <v2-virtual-tree :load="loadNode" lazy></v2-virtual-tree>
  </div>
</template>
<script>
let id = 0;
export default {
  data() {
    return {
      // data: [{
      //     id: 1,
      //     label: '一级 1',
      //     children: [{
      //       id: 4,
      //       label: '二级 1-1',
      //       children: [{
      //         id: 9,
      //         label: '三级 1-1-1'
      //       }, {
      //         id: 10,
      //         label: '三级 1-1-2'
      //       }]
      //     }]
      //   }, {
      //     id: 2,
      //     label: '一级 2',
      //     children: [{
      //       id: 5,
      //       label: '二级 2-1'
      //     }, {
      //       id: 6,
      //       label: '二级 2-2'
      //     }]
      //   }, {
      //     id: 3,
      //     label: '一级 3',
      //     children: [{
      //       id: 7,
      //       label: '二级 3-1'
      //     }, {
      //       id: 8,
      //       label: '二级 3-2'
      //     }]
      // }],
      data: [],
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
        console.log(arr.map(v => v.id))
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
