import axios from 'axios';

// this function is used directly in the vuex store within an action
async function getAllLights(rootState) {
  const { username } = rootState.bridge;
  const { internalipaddress } = rootState.bridge.bridge;
  const { data } = await axios.get(`http://${internalipaddress}/api/${username}/lights`);
  return data;
}

async function getLight(id, rootState) {
  const { username } = rootState.bridge;
  const { internalipaddress } = rootState.bridge.bridge;
  const { data } = await axios.get(`http://${internalipaddress}/api/${username}/lights/${id}`);
  return data;
}

export {
  getLight,
  getAllLights,
};
