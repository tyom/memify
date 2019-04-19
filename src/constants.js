const PRESETS = {
  kiosk: {
    bg: [{ url: 'https://kiosk-me.now.sh/kiosk.jpg', style: {} }],
    fg: [
      {
        url: 'https://kiosk-me.now.sh/kiosk-shade.png',
        style: {},
      },
    ],
    style: {
      bottom: '50px',
      right: '50px',
      fontSize: '80px',
      color: '#fff',
    },
  },
};

module.exports = {
  PRESETS,
};
