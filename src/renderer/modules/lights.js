import axios from 'axios';
import store from '../store';

const { username, bridge } = store.state.bridge;
const { internalipaddress } = bridge;

const makeHueApiUrl = id => `http://${internalipaddress}/api/${username}/lights/${id}`;
const makeHueApiStateUrl = id => `http://${internalipaddress}/api/${username}/lights/${id}/state`;
const searchNewLightsUrl = `http://${internalipaddress}/api/${username}/lights/`;
const getNewLightsUrl = `http://${internalipaddress}/api/${username}/lights/new`;

async function searchForLights() {
  const url = searchNewLightsUrl();
  const search = await axios.post(url);
  return search;
}

async function getNewLights(data = {}) {
  const url = getNewLightsUrl();
  const search = await axios.get(url, data);
  return search;
}

async function deleteLight(id) {
  const url = makeHueApiUrl(id);
  const action = await axios.delete(url);
  return action;
}

async function updateLightName(id, name) {
  const url = makeHueApiUrl(id);
  const action = await axios.put(url, { name });
  return action;
}

async function getLightInfo(id) {
  const url = makeHueApiUrl(id);
  const info = await axios.get(url);
  return info;
}

async function setLightState(id, payload) {
  const url = makeHueApiStateUrl(id);
  const res = await axios.put(url, payload);
  return res;
}

const toggeLightStatus = (id) => {
  const info = getLightInfo(id);
  info.then((response) => {
    const { data } = response;
    const { on, reachable } = data.state;
    if (reachable) {
      const updated = setLightState(id, { on: !on });
      updated.then(() => {
        const newState = {
          ...data,
          state: {
            ...data.state,
            on: !on,
          },
        };
        store.dispatch('updateLight', {
          id,
          newState,
        });
      });
    }
  });
};

function handleBoundLights() {
  const { boundLights } = store.state.settings;
  boundLights.map(toggeLightStatus);
}


export {
  updateLightName,
  toggeLightStatus,
  deleteLight,
  getNewLights,
  searchForLights,
  setLightState,
  handleBoundLights,
};
