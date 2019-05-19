import WebFont from 'webfontloader';

export async function loadWebFont(webfont) {
  if (!webfont) {
    return;
  }
  return new Promise(resolve => {
    WebFont.load({
      ...webfont,
      active: () => resolve(webfont),
    });
  });
}
