import Konva from 'konva';

export async function createStageComponents({ el, meme }) {
  if (!meme) {
    throw new Error('No preset in `createStageComponents`');
  }
  const { caption } = meme;
  const textConfig = {
    ...caption,
    fontSize:
      caption.fontSize === 'auto'
        ? caption.minFontSize || 12
        : caption.fontSize,
  };

  return {
    stage: new Konva.Stage({
      container: el,
      width: meme.image && meme.image.width,
      height: meme.image && meme.image.height,
    }),

    layer: new Konva.Layer(),

    caption: new Konva.Text({
      ...textConfig,
      text: '',
      name: 'textOverlay',
      draggable: true,
    }),
  };
}

export function populateLayer(layer, components = []) {
  if (!layer) {
    return;
  }
  components.forEach(component => {
    layer.add(component);
  });
  return layer;
}

export async function createImage({
  src,
  width,
  height,
  name,
  listening,
} = {}) {
  if (!src) {
    return;
  }
  const imageEl = new window.Image(width, height);
  imageEl.src = src;

  const image = new Konva.Image({
    name,
    listening,
    image: imageEl,
  });

  image.setAttrs({
    width: image.getWidth(),
    height: image.getHeight(),
  });

  return new Promise((resolve, reject) => {
    imageEl.onload = () => resolve(image);
    imageEl.onerror = reject;
  });
}
