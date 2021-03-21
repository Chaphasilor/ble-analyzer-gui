module.exports = {
  purge: {
    content: [
      // scans your html files for tailwind classes and deletes any unused class definitions when building for production
      // I can't think of any reason why you should change this
      `./index.html`,
      `./src/**/*.{vue,js,ts,jsx,tsx}`,
    ],
  },
  presets: [
    // don't modify this preset if you don't know exactly what you're doing!
    require(`./extended-colors.preset.js`),
    // add your own presets below this line :)
  ],
  darkMode: `media`,
  theme: {
    extend: {
      gridTemplateRows: {
        // 'main': `4rem 3rem 3fr 1fr`,
        'main': `3rem minmax(0, 1fr)`,
        'left': `2rem minmax(0, 3fr) 1fr`,
        // Simple 8 row grid
        'layout': '2.5rem minmax(10rem, 1fr) minmax(0, 16rem)',
      },
      gridTemplateColumns: {
        'main': `2fr 1fr`,
        'packet-list': '8ch 15ch 8ch 10ch 18ch 15ch 12ch minmax(10ch, 1fr) 8ch 5ch',
        'connection-list': 'minmax(8ch, 1fr) minmax(15ch, 2fr) minmax(20ch, 2fr) minmax(20ch, 2fr) minmax(15ch, 1fr) minmax(10ch, 1fr) 8ch 3ch',
        'advertiser-list': 'minmax(20ch, 1fr) minmax(20ch, 1fr) minmax(20ch, 1fr) minmax(20ch, 1fr)',
      },
      strokeWidth: {
        '1.5': `1.5`,
      }
    },
  },
  variants: {},
  plugins: [],
}