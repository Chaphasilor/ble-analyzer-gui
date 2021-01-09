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
        // Simple 8 row grid
        'layout': '2.5rem minmax(10rem, 1fr) 16rem',
      },
      gridTemplateColumns: {
        'packet-list': '5ch 1fr 1fr 1fr 3fr 7ch',
      }
    },
  },
  variants: {},
  plugins: [],
}