const timer = require('./timer');
const weVibeCommand = require('./command');

const off = async (ch) => {
  await weVibeCommand(ch, {
    mode: 0,
    inner: 0,
    outer: 0
  });
};

const on = async (ch, i) => {
  await weVibeCommand(ch, {
    mode: 3,
    inner: i,
    outer: i
  });
}

module.exports = async (ch) => {
  for (let x = 0; x < 3; ++x) {
    await on(ch, 7);
    await timer(250);
    await off(ch);
    await timer(1000);
  }
  await on(ch, 15);
  await timer(250);
  await off(ch);
};
