const formateError = (error) => {
  if (error.code === 4001) return error.message;

  let i = error.message.indexOf('revert');
  let message = error.message.slice(i + 7);
  // let j = message.indexOf('"');
  let errMessage = message.split('"')[0];

  return errMessage;
};

export default formateError;
