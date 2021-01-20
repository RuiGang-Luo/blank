const state = {
  navbar: {
    height: 0
  },
  tagsView: {
    height: 0
  }
}

const mutations = {
  COMPONENT_HEIGHT: (state, info) => {
    // console.log('set ' + info.componentName + ' height:' + info.height)
    state[info.componentName].height = info.height
  }
}

const actions = {
  setComponentHeight ({ commit }, info) {
    commit('COMPONENT_HEIGHT', info)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
