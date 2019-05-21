<template>
  <div class="Stage"></div>
</template>

<script>
import Konva from 'konva';
import { merge } from 'lodash';
import { createStageComponents, populateLayer, createImage } from '../konva';
import { loadWebFont } from '../utils';

export default {
  props: {
    preset: {
      type: Object,
      required: true,
    },
    presetKey: {
      type: String,
      required: true,
      default: '',
    },
    text: {
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
    '$route.params.preset'() {
      this.buildStage();
    },
    text(caption) {
      this.updateCaption(caption);
    },
  },
  mounted() {
    this.buildStage();
  },
  methods: {
    setUpEvents() {
      this.layer.on('click tap', this.handleLayerClick);
      this.caption.on('transform dragend', this.updateCaptionTransform);

      window.addEventListener('click', this.handleDocumentClick);
      window.addEventListener('resize', this.fitStageToScreen);
    },

    async buildStage() {
      const { stage, layer, caption } = await createStageComponents({
        el: this.$el,
        preset: this.preset,
      });
      this.stage = stage;
      this.layer = layer;
      this.caption = caption;

      this.setUpEvents();
      await loadWebFont(this.preset.webfont);

      const compositionLayer = await this.buildLayer(this.preset);
      this.stage.add(compositionLayer);

      this.fitStageToScreen();
      this.updateCaption(this.text);
    },

    async buildLayer(preset = {}) {
      const bgrImage = await createImage({
        ...preset.bgr,
        name: 'backgroundImage',
      });
      const fgrImage = await createImage({
        ...preset.fgr,
        name: 'foregroundImage',
        listening: false,
      });

      const layerComponents = [bgrImage, this.caption, fgrImage].filter(
        Boolean
      );

      return populateLayer(this.layer, layerComponents);
    },

    fitStageToScreen() {
      const parentContainer = this.$el.parentElement;
      const { width, height } = this.preset.bgr;
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

    updateCaption(text) {
      this.caption.text(text);

      if (this.preset.text.fontSize === 'auto') {
        const fontSize = this.getAutoFontSize(text);
        this.caption.fontSize(fontSize);
      }

      this.layer.draw();
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
        scale: { x: 1, y: 1},
      });
      this.$emit(
        'update:preset',
        merge({}, this.preset, {
          text: this.caption.attrs,
        })
      );
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
