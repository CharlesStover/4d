const fs = require('fs');

module.exports = (file) => {
  const story = fs.readFileSync(file).toString('utf8').split('\n');
  const patterns = [];
  for (const scene of story) {
    if (scene !== '') {
      const [ , ms, mode, inner, outer ] = scene.match(/^(\d+) (\d+) (\d+) (\d+)$/);
      patterns.push([
        parseInt(ms),
        parseInt(mode),
        parseInt(inner),
        parseInt(outer)
      ]);
    }
  }
  return patterns;
};
