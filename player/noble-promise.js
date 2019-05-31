module.exports = async (describe, that, it, ...args) => {
  return new Promise(
    (resolve, reject) => {
      it.bind(that)(...args, (error, response) => {
        if (error) {
          console.log('Error' + (describe ? ' ' + describe : '') + ':', error);
          reject(error);
          process.exit();
        }
        else {
          if (describe) {
            const message = describe.replace(/ing /, 'ed ');
            console.log(message.substring(0, 1).toUpperCase() + message.substring(1) + '!');
          }
          resolve(response);
        }
      }
    );
  });
};
