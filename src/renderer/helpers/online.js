import store from '../store';

const updateOnlineStatus = () => {
  const { onLine } = navigator;
  store.dispatch('setOnlineStatus', onLine);
};

export default updateOnlineStatus;
