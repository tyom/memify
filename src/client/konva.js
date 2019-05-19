import Konva from 'konva';

export async function createStageComponents({ el, preset }) {
  const textConfig = {
    ...preset.text,
    fontSize:
      preset.text.fontSize === 'auto'
        ? preset.text.minFontSize || 12
        : preset.text.fontSize,
  };

  return {
    stage: new Konva.Stage({
      container: el,
      width: preset.bgr.width,
      height: preset.bgr.height,
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
  components.filter(Boolean).forEach(component => {
    layer.add(component);
  });
  return layer;
}

export async function createImage({
  url,
  width,
  height,
  name,
  listening,
} = {}) {
  if (!url) {
    return;
  }
  const imageEl = new window.Image(width, height);
  imageEl.src = url;

  const image = new Konva.Image({
    name,
    listening,
    image: imageEl,
  });

  return new Promise(resolve => {
    imageEl.onload = () => resolve(image);
  });
}
