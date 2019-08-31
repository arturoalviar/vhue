import axios from 'axios';
import https from 'https';
import _kebabcase from 'lodash.kebabcase';

const hueApiUrl = ip => `http://${ip}/api`;
const hueApiBridgeUrl = 'https://discovery.meethue.com/';

async function findBridges() {
  const bridges = await axios.get(hueApiBridgeUrl);
  return bridges;
}

async function configureUsername({ name, ip }) {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const sanitizedName = _kebabcase(name);
  const data = { devicetype: `vuehue#${sanitizedName}` };
  const config = {
    httpsAgent,
    headers: { 'content-type': 'application/json' },
    responseType: 'json',
  };
  const url = hueApiUrl(ip);
  const posted = await axios.post(url, data, config);

  return posted;
}

function emitBridgeFlash(isError) {
  let message;
  if (isError) {
    message = {
      text: 'No bridges found. Please try again.',
      status: 'error',
    };
  } else {
    message = {
      text: 'Bridge found',
      status: 'success',
    };
  }
  return message;
}

export {
  configureUsername,
  emitBridgeFlash,
  findBridges,
};
