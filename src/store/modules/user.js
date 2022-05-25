import { login, logout, getInfo, wxbind } from '@/api/user'
import { getInfoByCode } from '@/api/util'
import { registerAccount } from '@/api/account'

import { getToken, setToken, removeToken, setAccount, setOpenId } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  account_id: '',
  username: '',
  introduction: '',
  roles: [],
  open_id: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ACCOUNT_ID: (state, account_id) => {
    state.account_id = account_id
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_OPENID: (state, open_id) => {
    state.open_id = open_id
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code, phone } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: code, phone: phone }).then(response => {
        commit('SET_TOKEN', response.token)
        commit('SET_ACCOUNT_ID', response.account_id)
        setToken(response.token)
        setAccount(response.account_id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  register({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      registerAccount(userInfo).then(response => {
        commit('SET_TOKEN', response.token)
        commit('SET_ACCOUNT_ID', response.account_id)
        setToken(response.token)
        setAccount(response.account_id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  wxbind({ commit }, userInfo) {
    const { username, phone, code, open_id } = userInfo
    return new Promise((resolve, reject) => {
      wxbind({ username: username, phone: phone.trim(), code: code, open_id: open_id }).then(response => {
        commit('SET_TOKEN', response.token)
        commit('SET_ACCOUNT_ID', response.account_id)
        setToken(response.token)
        setAccount(response.account_id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token, state.account_id).then(response => {
        const data = response.accounts[0]
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, username, account_id } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_USERNAME', username)
        // commit('SET_AVATAR', avatar)
        commit('SET_ACCOUNT_ID', account_id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfoByCode({ commit }, code) {
    return new Promise((resolve, reject) => {
      getInfoByCode(code).then(response => {
        const needBind = response.need_bind
        if (needBind) {
          const open_id = response.open_id
          commit('SET_OPENID', open_id)
          setOpenId(open_id)
          resolve(response)
        } else {
          const { username, account_id } = response.account_info
          const open_id = response.open_id
          commit('SET_USERNAME', username)
          commit('SET_ACCOUNT_ID', account_id)
          commit('SET_OPENID', open_id)
          commit('SET_TOKEN', response.token)
          setToken(response.token)
          setAccount(account_id)
          setOpenId(open_id)
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
