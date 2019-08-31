import { getAllRooms, getRoom } from '../../modules/store-groups';

const state = {
  groups: {},
};

const getters = {
  getGroups: state => state.groups,
  getGroupById: state => id => state.groups[id],
};

const mutations = {
  SET_GROUP(state, payload) {
    const { id, newState } = payload;
    state.groups[id] = { ...state.groups[id], ...newState };
  },
  SET_GROUPS(state, payload) {
    state.groups = { ...state.groups, ...payload };
  },
  DELETE_GROUP(state, payload) {
    delete state.groups[payload];
  },
};

const actions = {
  setGroups({ commit, rootState }) {
    const rooms = getAllRooms(rootState);
    rooms
      .then((data) => {
        commit('SET_GROUPS', data);
      });
  },
  setGroup({ commit, rootState }, id) {
    const room = getRoom(id, rootState);
    room
      .then((data) => {
        const { lights, name } = data;
        const newState = {
          class: data.class,
          name,
          lights,
        };
        commit('SET_GROUP', {
          id,
          newState,
        });
      });
  },
  updateGroup({ commit }, payload) {
    commit('SET_GROUP', payload);
  },
  deleteGroup({ commit }, payload) {
    commit('DELETE_GROUP', payload);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
