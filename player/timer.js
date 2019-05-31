module.exports = (n) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, n);
  });
