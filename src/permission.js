import router from './router'
import store from './store'
import { constantRoutes } from '@/router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = (() => {
  const list = []
  for (const index in constantRoutes) {
    list.push(constantRoutes[index].path)
  }
  return list
})()
// ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  // 在页面加载时读取sessionStorage里的状态信息
  if (sessionStorage.getItem('user')) {
    await store.dispatch('user/resetUser', Object.assign(JSON.parse(sessionStorage.getItem('user')), { roles: [] }))
    sessionStorage.removeItem('user')
    //
  }
  // const hasToken = getToken()
  const hasToken = store.getters.token
  // console.log(hasToken)
  // if (to.path === '/entrance') {
  //   // if is logged in, redirect to the home page
  //   // next({ path: '/' })
  //   next()
  //   NProgress.done()
  // }
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      // next()
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // next()
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // 登录后刷新token过期时间，并注销之前登录
          // debugger
          // await store.dispatch('user/refreshToken')
          // 获取用户信息
          const { roles } = await store.dispatch('user/getInfo')
          // 获取机构信息
          console.log(await store.dispatch('user/getOrgCode'))
          // 获取菜单路由信息
          // await store.dispatch('menu/generateRouters')
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
