const createActionFlash = (isSuccessful, payload) => {
  const {
    type,
    name,
    action,
    error,
  } = payload;
  let text;
  let status;

  if (isSuccessful) {
    text = name ? `${type} was successfully ${action} to: ${name}`
      : `${type} was successfully ${action}.`;
    status = 'success';
  } else {
    text = `${type} was not ${action}.`;
    text = error ? `${text}. Error: ${error}` : text;
    status = 'error';
  }
  return {
    text,
    status,
  };
};


export default createActionFlash;
