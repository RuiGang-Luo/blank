import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: '',
  refreshToken: '',
  name: '',
  avatar: '',
  introduction: '',
  timer: null,
  orgCode: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TIMER: (state, timer) => {
    state.timer = timer
  },
  SET_ORG_CODE: (state, orgCode) => {
    state.orgCode = orgCode
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      commit('SET_REFRESH_TOKEN', 'refresh_token')
      commit('SET_TOKEN', 'access_token')
      // setToken(access_token)
      resolve()
    })
  },
  // refresh token
  refreshToken ({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.info('token已过期,获取refreshtoken。。。。')
      console.info(state.refreshToken)
      commit('SET_REFRESH_TOKEN', 'refresh_token')
      commit('SET_TOKEN', 'access_token')
      // setToken(access_token)
      resolve()
    })
  },
  // refresh session expires time
  refreshSessionExpires ({ commit, state }, initTime) {
    sessionStorage.setItem('expires_in', initTime)

    if (state.timer === null) {
      const timer = setInterval(() => {
        let time = sessionStorage.getItem('expires_in')
        if (time === '0') {
          console.log('The session has expired')
          clearInterval(state.timer)
          logout(state.token).then(() => {
            commit('SET_TIMER', null)
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            resetRouter()
            router.push({ path: '/login', query: { expired: true }})
            sessionStorage.removeItem('expires_in')
          })
        } else {
          time = --time
          sessionStorage.setItem('expires_in', time)
        }
      }, 1000)
      commit('SET_TIMER', timer)
    }
  },
  // get user info
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      let response = getInfo(state.token);
      console.log(response)
      const { userAuthentication } = response
      console.log(userAuthentication)
      if (!userAuthentication) {
        reject('Verification failed, please Login again.')
      }
      const { principal } = userAuthentication
      const { authorities, username, avatar, introduction } = principal
      const userName = username.replace(/@(\s|\S)+?@/, '')
      // roles must be a non-empty array
      if (!authorities || authorities.length <= 0) {
        // reject('getInfo: roles must be a non-null array!')
        reject('该用户没有任何权限，请赋权限后登陆')
      }
      const roles = []
      for (const index in authorities) {
        roles.push(authorities[index].authority)
      }
      commit('SET_ROLES', roles)
      commit('SET_NAME', userName)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      resolve({
        roles,
        name: userName,
        avatar,
        introduction
      })
    })
  },
  getOrgCode ({ commit, state }) {
    return new Promise((resolve, reject) => {
      resolve({
        userName: 'admin',
        orgCode: '000'
      })
    })
  },
  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      clearInterval(state.timer)
      commit('SET_TIMER', null)
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      // removeToken()
      resolve()
    })
  },
  //
  resetUser ({ commit }, user) {
    return new Promise(async resolve => {
      commit('SET_TOKEN', user.token)
      commit('SET_ROLES', user.roles)
      commit('SET_REFRESH_TOKEN', user.refreshToken)
      commit('SET_INTRODUCTION', user.introduction)
      commit('SET_NAME', user.name)
      commit('SET_AVATAR', user.avatar)
      resolve()
    })
  },
  // remove roles
  resetRoles ({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROLES', [])
      // removeToken()
      resolve()
    })
  },
  // dynamically modify permissions
  changeRoles ({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      // setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
