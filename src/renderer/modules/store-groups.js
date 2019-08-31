import axios from 'axios';

// this function is used directly in the vuex store within an action
async function getAllRooms(rootState) {
  const { username } = rootState.bridge;
  const { internalipaddress } = rootState.bridge.bridge;
  const { data } = await axios.get(`http://${internalipaddress}/api/${username}/groups`);
  return data;
}

async function getRoom(id, rootState) {
  const { username } = rootState.bridge;
  const { internalipaddress } = rootState.bridge.bridge;
  const { data } = await axios.get(`http://${internalipaddress}/api/${username}/groups/${id}`);
  return data;
}

export {
  getRoom,
  getAllRooms,
};
