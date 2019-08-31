const state = {
  bridge: {},
  bridgeName: 'my-elhuey-bridge',
  username: '',
  needsSetup: true,
};

const getters = {
  getBridge: state => state.bridge,
  getBridgeName: state => state.bridgeName,
  getUsername: state => state.username,
  getNeedsSetup: state => state.needsSetup,
};

const mutations = {
  SET_BRIDGE(state, payload) {
    state.bridge = payload;
  },
  SET_BRIDGE_NAME(state, payload) {
    state.bridgeName = payload;
  },
  SET_USERNMAE(state, payload) {
    state.username = payload;
  },
  SET_NEEDS_SETUP(state, payload) {
    state.needsSetup = payload;
  },
};

const actions = {
  setBridge({ commit }, payload) {
    commit('SET_BRIDGE', payload);
  },
  setBridgeName({ commit }, payload) {
    commit('SET_BRIDGE_NAME', payload);
  },
  setUsername({ commit }, payload) {
    commit('SET_USERNMAE', payload);
  },
  setNeedsSetup({ commit }, payload) {
    commit('SET_NEEDS_SETUP', payload);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
