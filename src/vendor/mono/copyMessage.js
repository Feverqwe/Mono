const copyMessage = message => {
  return message && JSON.parse(JSON.stringify(message));
};

export default copyMessage;