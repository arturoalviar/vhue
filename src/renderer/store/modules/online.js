const state = {
  online: true,
};

const getters = {
  getOnlineStatus: state => state.online,
};

const mutations = {
  SET_ONLINE_STATUS(state, payload) {
    state.online = payload;
  },
};

const actions = {
  setOnlineStatus({ commit }, payload) {
    commit('SET_ONLINE_STATUS', payload);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
