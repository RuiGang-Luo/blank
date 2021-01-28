import { getAllMenu } from '@/api/menu'
import Layout from '@/layout'

const state = {
  routers: []
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  }
}

const actions = {
  generateRouters ({ commit }) {
    return new Promise((resolve, reject) => {
      // getAllMenu().then(response => {
      //   const asyncRouters = finterAsyncRouters(response)
      //   commit('SET_ROUTERS', asyncRouters)
      //   // console.log('state.routers', state.routers)
      //   // router.addRoutes(asyncRouters)
      //   resolve(state.routers)
      // }).catch(error => {
      //   reject(error)
      // })
      const asyncRouters = finterAsyncRouters(response)
      //   commit('SET_ROUTERS', asyncRouters)
      //   // console.log('state.routers', state.routers)
      //   // router.addRoutes(asyncRouters)
      //   resolve(state.routers)
    })
  }
}

function finterAsyncRouters (response) {
  const routes = []

  response.menuList.filter(route => {
    const meta = {
      title: route.menuName,
      icon: route.menuIcon
    }
    if (route.isLeaf === 1) {
      if (route.isPower) {
        meta.roles = ['menu.' + route.menuId]
      }
    }
    routes.push({
      path: '/' + route.menuId,
      alwaysShow: true,
      // component import 不可以引用对象 只能全部引用字符串或者通过字符串模板来提供部分信息
      component: route.menuComponent === '@/layout' ? Layout : () => import(`@/views/${route.menuComponent}`),
      name: route.menuId,
      hidden: route.isHidden === 1,
      meta: meta,
      children: []
    })

    /* if (route.menuComponent === '@/layout') {
      routes[routes.length - 1].component = Layout
    } else {
      routes[routes.length - 1].component = import(route.menuComponent)
    }*/

    const id = route.menuId.toString()
    // console.log('response.id', response[id])
    if (response[id]) {
      insertRouters(routes[routes.length - 1], response, id)
    } else {
      delete routes[routes.length - 1].children
      // this.$delete(routes[routes.length-1],'children')
    }
  })

  routes.push({ path: '*', redirect: '/dashboard', hidden: true })
  // console.log('routes', routes)
  return routes
}

function insertRouters (menuSelect, allData, pid) {
  // let toComponent = '@/views/system/management/menu'
  allData[pid].filter(data => {
    const meta = {
      title: data.menuName,
      icon: data.menuIcon
    }
    if (data.isLeaf === 1) {
      if (data.isPower) {
        meta.roles = ['menu.' + data.menuId]
      }
    }
    menuSelect.children.push({
      path: '/' + data.menuId,
      component: data.menuComponent === '@/layout' ? Layout : () => import(`@/views/${data.menuComponent}`),
      name: data.menuId,
      hidden: data.isHidden === 1,
      meta: meta,
      children: []
    })

    const menuId = data.menuId.toString()
    if (allData[menuId] !== undefined && allData[menuId]) {
      insertRouters(menuSelect.children[menuSelect.children.length - 1], allData, menuId)
    } else {
      delete menuSelect.children[menuSelect.children.length - 1].children
      // this.$delete(menuSelect.children[menuSelect.children.length-1],'children')
    }
  })
/*  for (let t = 0; t < allData[pid].length; t++) {
     /!*let isHidden = ''
    if (allData[pid][t].isLeaf === 0) {
      if (allData[pid][t].isHidden === 1) {
        isHidden = 'alwaysShow:true'
      } else {
        isHidden = 'alwaysShow:false'
      }
    } else if (allData[pid][t].isLeaf === 1) {
      if (allData[pid][t].isHidden === 1) {
        isHidden = ' hidden:true'
      } else {
        isHidden = ' hidden:false'
      }
    }*!/

    menuSelect.children.push({
      path: allData[pid][t].menuId,
      component: import(allData[pid][t].menuComponent),
      name: allData[pid][t].menuId,
      //isHidden,
      meta: {
        title: allData[pid][t].menuName,
        roles: ['admin'],
        icon: allData[pid][t].menuIcon
      },
      children: []
    })
    const menuId = allData[pid][t].menuId.toString()
    if (allData[menuId] !== undefined && allData[menuId]) {
      insertRouters(menuSelect.children[menuSelect.children.length - 1], allData, menuId)
    } else {
      delete menuSelect.children[menuSelect.children.length - 1].children
      // this.$delete(menuSelect.children[menuSelect.children.length-1],'children')
    }
  }*/
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
