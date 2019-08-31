import { getAllLights, getLight } from '../../modules/store-lights';

const state = {
  lights: {},
};

const getters = {
  getLights: state => state.lights,
  getLightById: state => id => state.lights[id],
};

const mutations = {
  SET_LIGHT(state, payload) {
    const { id, newState } = payload;
    state.lights[id] = { ...state.lights[id], ...newState };
  },
  SET_LIGHTS(state, payload) {
    state.lights = { ...state.lights, ...payload };
  },
  DELETE_LIGHT(state, payload) {
    delete state.lights[payload];
  },
};

const actions = {
  setLights({ commit, rootState }) {
    const lights = getAllLights(rootState);
    lights
      .then((data) => {
        commit('SET_LIGHTS', data);
      });
  },
  setLight({ commit, rootState }, id) {
    const light = getLight(id, rootState);
    light
      .then((data) => {
        const { name, state } = data;
        const newState = {
          name,
          state,
        };
        commit('SET_LIGHT', {
          id,
          newState,
        });
      });
  },
  updateLight({ commit }, payload) {
    commit('SET_LIGHT', payload);
  },
  deleteLight({ commit }, payload) {
    commit('DELETE_LIGHT', payload);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
