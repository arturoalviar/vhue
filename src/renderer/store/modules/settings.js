const getInitalState = () => (
  {
    defaultView: 'groups',
    theme: 'light',
    boundLights: [],
  }
);

const state = getInitalState();

const getters = {
  getTheme: state => state.theme,
  getDefaultView: state => state.defaultView,
  getBoundLights: state => state.boundLights,
};

const mutations = {
  SET_THEME(state, payload) {
    state.theme = payload;
  },
  SET_DEFAULT_VIEW(state, payload) {
    state.defaultView = payload;
  },
  SET_BOUND_LIGHTS(state, payload) {
    state.boundLights = payload;
  },
  RESET_STATE(state) {
    Object.assign(state, getInitalState());
  },
};

const actions = {
  setTheme({ commit }, payload) {
    commit('SET_THEME', payload);
  },
  setDefaultView({ commit }, payload) {
    commit('SET_DEFAULT_VIEW', payload);
  },
  setBoundLights({ commit }, payload) {
    commit('SET_BOUND_LIGHTS', payload);
  },
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
