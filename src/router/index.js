import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import getters from "../store/getters";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * isShow: false                  if set false, will not show the root menu and its children
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/entrance',
    component: () => import('@/views/public/entrance/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { isShow: false },
    children: [
      {
        path: 'dashboard',
        hidden: true,
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

export const rolesRoutes = function () {
  // console.log(getters.addRouters)
  // let test = []
  return [

    {
      path: '/desk',
      component: Layout,
      redirect: '/dashboard',
      meta: { isShow: true },
      children: [
        {
          path: '/desklist',
          component: () => import('@/views/desklist/index'),
          isShow: true,
          name: 'Management',
          meta: {
            title: '主机列表',
            // roles: ['editor'],
            icon: 'example'
          }
        }
      ]
    }
    ,{
      path: '/job',
      component: Layout,
      redirect: '/dashboard',
      meta: { isShow: true },
      children: [
        {
          path: '/joblist',
          component: () => import('@/views/joblist/index'),
          name: 'Management',
          isShow: true,
          meta: {
            title: '任务列表',
            // roles: ['editor'],
            icon: 'example'
          }
        }
      ]
    }]
  // console.log('test',test)
  // console.log('getters',getters.state.menu.addRouters)
  // console.log('路由中的routers',store.getters.addRouters)
}
//   [
//   {
//     path: '/organization',
//     component: Layout,
//     alwaysShow: true,
//     // redirect: '/management',
//     name: 'organization',
//     meta: {
//       title: '机构管理',
//       roles: ['admin'],
//       icon: 'peoples'
//     },
//     children: [
//     //   {
//     //   path: '/customer/management',
//     //   component: () => import('@/views/custom/management/index'),
//     //   name: 'customerManagement',
//     //   meta: {
//     //     title: '客户管理',
//     //     roles: ['admin'],
//     //     icon: 'peoples'
//     //   }
//     // },
//     // {
//     //   path: '/customer/info',
//     //   component: () => import('@/views/custom/info/index'),
//     //   name: 'Management',
//     //   meta: {
//     //     title: '客户信息',
//     //     roles: ['editor'],
//     //     icon: 'example'
//     //   }
//     // },
//       {
//         path: '/organizationList',
//         component: () => import('@/views/organization/management/index'),
//         name: 'organizationList',
//         meta: {
//           title: '机构列表',
//           roles: ['admin'],
//           icon: 'example'
//         }
//       },
//       {
//         path: '/protocol',
//         component: () => import('@/views/organization/protocol/index'),
//         name: 'protocol',
//         meta: {
//           title: '协议管理',
//           roles: ['admin'],
//           icon: 'peoples'
//         }
//       }
//     ]
//   },
//   {
//     path: '/service/configuration',
//     component: Layout,
//     name: 'ProductConfiguration',
//     meta: {
//       title: '产品配置',
//       roles: ['admin'],
//       icon: 'table'
//     },
//     children: [{
//       path: '/service/configuration/productDefinition',
//       component: () => import('@/views/product/configuration/definition'),
//       name: 'ProductDefinition',
//       meta: {
//         title: '产品定义',
//         roles: ['admin'],
//         icon: 'table'
//       }
//     }, {
//       path: '/service/configuration/setMeal',
//       component: () => import('@/views/product/configuration/setMeal'),
//       name: 'ProductDefinition',
//       meta: {
//         title: '核心套餐',
//         roles: ['admin'],
//         icon: 'table'
//       }
//     }, {
//       path: '/service/configuration/categoryOfRisk',
//       component: () => import('@/views/product/configuration/categoryOfRisk'),
//       name: 'ProductDefinition',
//       meta: {
//         title: '险种类别',
//         roles: ['admin'],
//         icon: 'table'
//       }
//     }]
//   },
//   {
//     path: '/service',
//     component: Layout,
//     hidden: true,
//     // redirect: '/management',
//     name: 'Service',
//     meta: { title: '服务定制', icon: 'example' },
//     children: [
//
//       // {
//       //   path: '/service/interfaceManagement ',
//       //   component: () => import('@/views/interface/management'),
//       //   name: 'InterfaceManagement',
//       //   meta: {
//       //     title: '接口管理',
//       //     roles: ['admin'],
//       //     icon: 'tree-table'
//       //   }
//       // },
//       {
//         path: '/service/productInfo',
//         component: () => import('@/views/product/info'),
//         name: 'ProductInfo',
//         hidden: true,
//         meta: {
//           title: '产品信息',
//           roles: ['admin'],
//           icon: 'example'
//         }
//       },
//       {
//         path: '/service/productManagement',
//         component: () => import('@/views/product/management'),
//         name: 'productManagement',
//         hidden: true,
//         meta: {
//           title: '产品信息',
//           roles: ['admin'],
//           icon: 'example'
//         }
//       }]
//   },
//
//   {
//     path: '/access',
//     component: Layout,
//     name: 'access',
//     meta: {
//       title: '接入配置',
//       roles: ['admin'],
//       icon: 'tree-table'
//     },
//     children: [
//       {
//         path: '/service/serviceOrchestration',
//         component: () => import('@/views/service/management'),
//         name: 'ServiceOrchestration',
//         meta: {
//           title: '服务清单',
//           roles: ['admin'],
//           icon: 'nested'
//         }
//       }, {
//         path: '/interface/ParameterList',
//         component: () => import('@/views/interface/management/components/Parameter'),
//         name: 'ParameterList',
//         meta: {
//           title: '参数列表',
//           roles: ['admin'],
//           icon: 'tree-table'
//         }
//       }, {
//         path: '/interface/EncryptedConfiguration',
//         component: () => import('@/views/interface/management/components/Encryption'),
//         name: 'EncryptedConfiguration',
//         meta: {
//           title: '加密配置',
//           roles: ['admin'],
//           icon: 'tree-table'
//         }
//       }, {
//         path: '/InterfaceDefinition',
//         component: () => import('@/views/interface/management/components/index'),
//         name: 'InterfaceDefinition',
//         meta: {
//           title: '接口管理',
//           roles: ['admin'],
//           icon: 'tree-table'
//         },
//         children: [
//           {
//             path: '/interface/InterfaceDefinition',
//             component: () => import('@/views/interface/management/components/Interface'),
//             name: 'InterfaceDefinition',
//             meta: {
//               title: '接口定义',
//               roles: ['admin'],
//               icon: 'tree-table'
//             }
//           },
//           {
//             path: '/interface/ParameterConfiguration',
//             component: () => import('@/views/interface/management/components/Interface/Parameters'),
//             name: 'ParameterConfiguration',
//             // redirect: '/nested/menu1/menu1-2/menu1-2-1',
//             meta: {
//               title: '参数绑定',
//               roles: ['admin'],
//               icon: 'tree-table'
//             }
//           },
//           {
//             path: '/interface/ServiceConfiguration',
//             component: () => import('@/views/interface/management/components/Interface/Services'),
//             name: 'ServiceConfiguration',
//             meta: {
//               title: '服务绑定',
//               roles: ['admin'],
//               icon: 'tree-table'
//             }
//           },
//           {
//             path: '/interface/addInterface',
//             component: () => import('@/views/interface/management/components/Interface/Information')
//           },
//           {
//             path: '/interface/addParameter',
//             component: () => import('@/views/interface/management/components/Interface/addParameter'),
//             name: 'addParameter'
//           },
//           {
//             path: '/interface/addService',
//             component: () => import('@/views/interface/management/components/Interface/addService')
//           }
//         ]
//       }
//     ]
//   },
//   {
//     path: '/system',
//     component: Layout,
//     alwaysShow: true,
//     // redirect: '/management',
//     name: 'System',
//     meta: { title: '系统管理', roles: ['admin'], icon: 'component' },
//     children: [{
//       path: '/system/userManagement',
//       component: () => import('@/views/system/management/user'),
//       name: 'UserManagement',
//       meta: {
//         title: '用户管理',
//         icon: 'user'
//       }
//     },
//     {
//       path: '/system/menuManagement',
//       component: () => import('@/views/system/management/menu'),
//       name: 'MenuManagement',
//       meta: {
//         title: '菜单管理',
//         icon: 'list'
//       }
//     },
//     {
//       path: '/system/privilege',
//       component: () => import('@/views/system/management/privilege/index'),
//       name: 'PrivilegeConfiguration',
//       meta: {
//         title: '权限配置',
//         icon: 'lock'
//       }
//     },
//     // {
//     //   path: '/logConfiguration  ',
//     //   component: () => import('@/views/custom/management/index'),
//     //   name: 'LogConfiguration',
//     //   meta: {
//     //     title: '日志配置',
//     //     icon: 'example'
//     //   }
//     // },
//     {
//       path: '/system/visitStatistics',
//       component: () => import('@/views/accessStatistics'),
//       name: 'visitStatistics',
//       meta: {
//         title: '访问统计',
//         icon: 'chart'
//       }
//     },
//     {
//       path: '/system/noticeManagement',
//       component: () => import('@/views/system/management/notice'),
//       name: 'NoticeManagement',
//       meta: {
//         title: '公告管理',
//         icon: 'email'
//       }
//     }]
//   },
//
//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/dashboard', hidden: true }
// ]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
