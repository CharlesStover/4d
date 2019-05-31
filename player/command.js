/*
(03) Vibrate - gentle waves

Waves (slow fuck):
(07) Wave - simultaneous
(08) Tide - alternating

Spikes (rough fuck):
(05) Pulse - simultaneous
(06) Echo - alternating
(15) Bounce - inner, inner, outer
(19) Cha Cha Cha - simultaneous, outer, inner, outer

Alternate:
(14) Surf - vibrating inside, rapid outside
*/

const noblePromise = require('./noble-promise');

let lastInner = 0;
let lastMode = 0;
let lastOuter = 0;

module.exports = (characteristic, options) => {
  const modes = [
    {
      // Single: -
      // Dual:   -
      hex: 0x00,
      name: 'off'
    },
    {
      hex: 0x01,
      name: 'unknown'
    },
    {
      hex: 0x02,
      name: 'unknown'
    },
    {
      // Single: FF0F
      // Dual    FF0F
      hex: 0x03,
      name: 'vibrate'
    },
    {
      // Single: 0FEF0FFE0FEF0FFE0FEF0FFE0FEF0FFE0FEFF034F034F034F034F034F034F034F034
      // Dual:   0FEF0FFE0FEF0FFE0FEF0FFE0FEF0FFE0FEFF034F034F034F034F034F034F034F034
      // internal: pulse / external: off
      hex: 0x04,
      name: 'peak'
    },
    {
      // Single: FF34
      // Dual:   FF34
      hex: 0x05,
      name: 'pulse'
    },
    {
      // Single: 0F09F009
      // Dual:   0F09F009
      hex: 0x06,
      name: 'echo'
    },
    {
      // Single: 22033303440355036603770388039903AA03BB03CC03DD03EE03FF0FFF0FEE03DD03CC03BB03AA0399038803770366035503440333032203
      // Dual:   22033303440355036603770388039903AA03BB03CC03DD03EE03FF0FFF0FEE03DD03CC03BB03AA0399038803770366035503440333032203
      hex: 0x07,
      name: 'wave'
    },
    {
      // Single: F403E503D603C703B803A9039A038B037C036D035E034F0F4F0F5E036D037C038B039A03A903B803C703D603E503F403
      // Dual:   F403E503D603C703B803A9039A038B037C036D035E034F0F4F0F5E036D037C038B039A03A903B803C703D603E503F403
      hex: 0x08,
      name: 'tide'
    },
    {
      hex: 0x09,
      name: 'unknown'
    },
    {
      hex: 0x0A,
      name: 'unknown'
    },
    {
      hex: 0x0B,
      name: 'unknown'
    },
    {
      hex: 0x0C,
      name: 'unknown'
    },
    {
      hex: 0x0D,
      name: 'unknown'
    },
    {
      // Single: FF080F08
      // Dual:   FF080F08
      hex: 0x0E,
      name: 'surf'
    },
    {
      // Single: 0F460F46F047
      // Dual:   0F460F46F047
      hex: 0x0F,
      name: 'bounce'
    },
    {
      // Single: FF06AA01
      // Dual:   FF06AA01
      hex: 0x10,
      name: 'massage'
    },
    {
      // Single: 0FFE0FFE0FFE0FFE0FFE0FFE0FFE0FFE0FFE0F710F710F710F710F710F710F710F710F710F710F710F710F710F710F71
      // Dual:   0FFE0FFE0FFE0FFE0FFE0FFE0FFE0FFE0FFE0F710F710F710F710F710F710F710F710F710F710F710F710F710F710F71
      hex: 0x11,
      name: 'tease'
    },
    {
      // Single: 0F000F00
      // Dual:   0F000F00
      // internal: vibrate / external: off
      hex: 0x12,
      name: 'crest'
    },
    {
      // Single: 0F0F0F0400690F0F0F0400690F990F990F99001F
      // Dual:   FF0FFF040048FF0FFF040048F0980F98F098000F
      hex: 0x13,
      name: 'cha cha cha'
    },
    {
      // Single: 550FAA0FFF0FFF08
      // Dual:   550FAA0FFF0FFF08
      hex: 0x14,
      name: 'step'
    },
    {
      // Single: 220D330D440D550D660D770D880D990DAA0DBB0DCC0DDD0DEE0DFF0FFF0F
      // Dual:   220D330D440D550D660D770D880D990DAA0DBB0DCC0DDD0DEE0DFF0FFF0F
      hex: 0x15,
      name: 'ramp'
    },
    {
      // Single: 223522353335443555356635773588359935AA35BB35CC35DD35EE35FF35FF35FF35FF35EE35DD35CC35BB35AA359935883577356635553544353335
      // Dual:   223522353335443555356635773588359935AA35BB35CC35DD35EE35FF35FF35FF35FF35EE35DD35CC35BB35AA359935883577356635553544353335
      hex: 0x16,
      name: 'tempo'
    },
    {
      // Single: AA043301FF25330F330F3302AA043301FF25330F330F3302AA043301FF25330F330F3302AA043301FF25330F330F3302AA043301FF25330F330F3302AA043301FF25330F3302AA043301FF25330F3302AA043301FF25330F3302AA043301FF25330F3302AA043301FF25330F3302AA043301FF25330F3302
      // Dual:   AA043301FF25330F330F3302AA043301FF25330F330F3302AA043301FF25330F330F3302AA043301FF25330F330F3302AA043301FF25330F330F3302AA043301FF25330F3302AA043301FF25330F3302AA043301FF25330F3302AA043301FF25330F3302AA043301FF25330F3302AA043301FF25330F3302
      hex: 0x17,
      name: 'heartbeat'
    }
  ];

  const mode =
    Object.prototype.hasOwnProperty.call(options, 'mode') &&
    Object.prototype.hasOwnProperty.call(modes, options.mode) ?
      modes[options.mode].hex :
      lastMode;
  if (mode !== lastMode) {
    console.log('Mode: ' + modes[options.mode].name);
    lastMode = options.mode;
  }

  const inner =
    Object.prototype.hasOwnProperty.call(options, 'inner') &&
    options.inner >= 0 &&
    options.inner <= 15 ?
      options.inner :
      lastInner;
  if (inner !== lastInner) {
    console.log('Vaginal: ' + inner);
    lastInner = inner;
  }

  const outer =
    Object.prototype.hasOwnProperty.call(options, 'outer') &&
    options.inner >= 0 &&
    options.outer <= 15 ?
      options.outer :
      lastOuter;
  if (outer !== lastOuter) {
    console.log('Clitoral: ' + outer);
    lastOuter = outer;
  }
  const cmd = new Buffer([ 0x0f, inner === 0 && outer === 0 ? 0x00 : mode, 0x00, inner * 16 + outer, 0x00, 0x03, 0x00, 0x00 ]);
  noblePromise(null, characteristic, characteristic.write, cmd, false);
};
