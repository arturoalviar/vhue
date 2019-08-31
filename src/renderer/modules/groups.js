import axios from 'axios';
import store from '../store';

const { username, bridge } = store.state.bridge;
const { internalipaddress } = bridge;

const makeHueApiUrl = id => `http://${internalipaddress}/api/${username}/groups/${id}`;
const hueApiRoomUrl = `http://${internalipaddress}/api/${username}/groups`;

async function createRoom(data) {
  const action = await axios.post(hueApiRoomUrl, data);
  return action;
}

async function deleteRoom(id) {
  const url = makeHueApiUrl(id);
  const action = await axios.delete(url);
  return action;
}

// can update group name or group lights
async function updateGroup(id, updatedValue) {
  const url = makeHueApiUrl(id);
  const action = await axios.put(url, updatedValue);
  return action;
}

async function getRoom(id) {
  const url = makeHueApiUrl(id);
  const action = await axios.get(url);
  return action;
}

export {
  createRoom,
  getRoom,
  updateGroup,
  deleteRoom,
};
