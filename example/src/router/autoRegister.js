const files = require.context("../demo", true, /.(vue|js)$/)
const routes = []
files.keys()
  .filter(v => isPage(v))
  .forEach(v => {
  let paths =  splitPath(v)
  push(routes, paths)
})

function matchFileName(str) {
  return str.match(/[^./]+(?=.(vue|js))/) && str.match(/[^./]+(?=.(vue|js))/)[0]
}

function isPage(str) {
  return /(vue|js?x)$/.test(str) && !/index.vue$/.test(str)
}

function splitPath(str) {
  return str.split("/").filter(v => v !== ".").map(v => {
    let t = matchFileName(v);
    return t ? t : v;
  })
}

function push(origin, pathArr, cur = 0) {
  let result = isExist(origin, pathArr[cur]);
  if (result !== -1) {
    push(origin[result].children, pathArr, ++cur)
  } else {
    let obj = {}
    createRoutes(pathArr, obj)
    origin.push(obj)
  }
}

function isExist(target, path) {
  let index = -1;
  target.forEach((v, i) => {
    if (v.path === path) {
      index = i
    }
  })
  return index
}

function createRoutes(target, obj) {
  target.forEach(v => {
    createRoute(v, obj, target)
  })
}

function createRoute(value, obj, path, level = 0) {
  if (!obj.path) {
    Object.assign(obj, {
      name: value,
      path: value,
      meta: { title: value },
      component: () => import(`../demo/${path.slice(0, level+1).join("/")}.vue`),
    })
  } else {
    obj.children = [{}]
    createRoute(value, obj.children[0], path, ++level)
  }
}

console.log(routes)
export default routes