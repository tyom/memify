<template>
  <div class="Stage"></div>
</template>

<script>
import Konva from 'konva';
import { isEqual, debounce } from 'lodash';
import { createStageComponents, populateLayer, createImage } from '../../konva';
import { loadWebFont } from '../../utils';

export default {
  props: {
    meme: {
      type: Object,
      default: () => ({}),
    },
    captionText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      stage: null,
      layer: null,
      caption: null,
    };
  },
  watch: {
    meme(meme, prevMeme) {
      if (!isEqual(meme.webfont, prevMeme.webfont) || meme.id !== prevMeme.id) {
        return this.buildStage();
      }
      this.updateCaption(this.meme.caption);
    },
  },
  mounted() {
    this.buildStage();
  },
  methods: {
    async buildStage() {
      if (!this.meme.id) {
        return;
      }
      const { stage, layer, caption } = await createStageComponents({
        el: this.$el,
        meme: this.meme,
      });
      this.stage = stage;
      this.layer = layer;
      this.caption = caption;

      await loadWebFont(this.meme.webfont);

      const composedLayer = await this.buildLayer(this.meme);
      this.stage.add(composedLayer);

      this.setUpEvents();
      this.fitStageToScreen();
      this.updateCaption({
        ...this.meme.caption,
        text: this.captionText,
      });
    },

    async buildLayer(meme = {}) {
      const image = await createImage({
        ...meme.image,
        name: 'image',
      });

      const overlayImage = await createImage({
        ...(meme.overlayImage || {} ),
        name: 'overlay',
        listening: false,
      });

      const layerComponents = [image, this.caption, overlayImage].filter(
        Boolean
      );

      return populateLayer(this.layer, layerComponents);
    },

    setUpEvents() {
      this.layer.on('click tap', this.handleLayerClick);
      this.caption.on('transform dragend', this.updateCaptionTransform);
      this.caption.on('transform dragend', debounce(this.emitUpdate, 500));

      window.addEventListener('click', this.handleDocumentClick);
      window.addEventListener('resize', this.fitStageToScreen);
    },

    fitStageToScreen() {
      const parentContainer = this.$el.parentElement;
      const { width, height } = this.meme.image;
      if (!parentContainer || !this.stage) {
        return;
      }
      const containerWidth = parentContainer.clientWidth;
      const scale = containerWidth / width;

      if (containerWidth < width) {
        this.stage.setAttrs({
          width: width * scale,
          height: height * scale,
          scale: { x: scale, y: scale },
        });
      }

      this.stage.draw();
    },

    updateCaption({ text, fontSize, fontFamily } = {}) {
      this.caption.text(text);

      const captionFontSize =
        fontSize === 'auto' ? this.getAutoFontSize(text) : fontSize;

      this.caption.fontSize(captionFontSize);
      this.caption.fontFamily(fontFamily);

      this.layer.draw();
    },

    emitUpdate() {
      this.$emit('update-caption', this.caption.attrs);
    },

    getAutoFontSize(text) {
      const box = this.caption.getClientRect();
      const textLines = this.caption.textArr;

      if (textLines.length === 0) {
        return;
      }
      const { minFontSize = 12, maxFontSize = 60 } = this.preset.text;
      let fontSize = box.width / (text.length * 0.8);
      if (fontSize < minFontSize) {
        fontSize = minFontSize;
      }
      if (fontSize > maxFontSize) {
        fontSize = maxFontSize;
      }
      return fontSize;
    },

    clearTransformers() {
      this.stage.find('Transformer').destroy();
      this.layer.draw();
    },

    addTransformer(shape) {
      const transformer = new Konva.Transformer();
      transformer.attachTo(shape);
      this.layer.add(transformer);
      this.layer.draw();
    },

    handleLayerClick(evt) {
      this.clearTransformers();

      if (evt.target.name() === 'textOverlay') {
        this.addTransformer(this.caption);
      }
    },

    handleDocumentClick(evt) {
      if (evt.target.nodeName === 'CANVAS') {
        return;
      }
      this.clearTransformers();
    },

    updateCaptionTransform() {
      this.caption.setAttrs({
        width: this.caption.width() * this.caption.scaleX(),
        height: this.caption.height() * this.caption.scaleY(),
        scale: { x: 1, y: 1 },
      });
    },
  },
};
</script>

<style>
.Stage {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.3);
  background-color: #222;
}
</style>
