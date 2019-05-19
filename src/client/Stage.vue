<template>
  <div class="Stage"></div>
</template>

<script>
import WebFont from 'webfontloader';
import Konva from 'konva';

export default {
  props: {
    preset: {
      type: Object,
      required: true,
    },
    presetKey: {
      type: String,
      required: true,
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
      localPreset: null,
    };
  },
  watch: {
    '$route.params.preset': {
      handler() {
        this.syncPreset();
      },
    },
    text: {
      handler(value) {
        this.updateCaption(value);
      },
    },
    localPreset: {
      deep: true,
      handler(preset) {
        this.$storage.set(this.presetKey, preset);
      }
    }
  },
  mounted() {
    this.syncPreset();
    this.buildStage();
  },
  methods: {
    setUpEvents() {
      this.layer.on('click tap', this.handleLayerClick);
      this.caption.on('transform', this.handleTextTransform);

      window.addEventListener('click', this.handleDocumentClick);
      window.addEventListener('resize', this.fitStageToScreen);
    },

    fitStageToScreen() {
      const parentContainer = this.$el.parentElement;
      if (!parentContainer) {
        return;
      }
      const stageWidth = this.localPreset.bgr.width;
      const stageHeight = this.localPreset.bgr.height;
      const containerWidth = parentContainer.clientWidth;
      const scale = containerWidth / stageWidth;

      if (containerWidth < stageWidth) {
        this.stage.width(stageWidth * scale);
        this.stage.height(stageHeight * scale);
        this.stage.scale({ x: scale, y: scale });
      }

      this.stage.draw();
    },

    async buildStage() {
      const textConfig = {
        ...this.localPreset.text,
        fontSize:
          this.localPreset.text.fontSize === 'auto'
            ? this.localPreset.text.minFontSize || 12
            : this.localPreset.text.fontSize,
      };
      this.stage = new Konva.Stage({
        container: this.$el,
        width: this.localPreset.bgr.width,
        height: this.localPreset.bgr.height,
      });
      this.layer = new Konva.Layer();
      this.caption = new Konva.Text({
        ...textConfig,
        name: 'textOverlay',
        draggable: true,
      });

      await this.loadWebFont();

      const bgrImage = await this.addImage({
        ...this.localPreset.bgr,
        name: 'backgroundImage',
      });
      const fgrImage = await this.addImage({
        ...this.localPreset.fgr,
        name: 'foregroundImage',
        listening: false,
      });

      this.layer.add(bgrImage);
      this.layer.add(this.caption);
      fgrImage && this.layer.add(fgrImage);
      this.stage.add(this.layer);


      this.updateCaption(this.text);
      this.setUpEvents();
      this.fitStageToScreen();
    },

    async addImage({ url, width, height, name, listening } = {}) {
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
    },

    updateCaption(text) {
      this.caption.text(text);

      if (!text.length) {
        this.layer.draw();
        return;
      }

      if (this.localPreset.text.fontSize === 'auto') {
        const box = this.caption.getClientRect();
        const textLines = this.caption.textArr;

        if (textLines.length === 1) {
          const { minFontSize = 12, maxFontSize = 60 } = this.localPreset.text;
          let fontSize = box.width / (text.length * 0.8);
          if (fontSize < minFontSize) {
            fontSize = minFontSize;
          }
          if (fontSize > maxFontSize) {
            fontSize = maxFontSize;
          }
          this.caption.fontSize(fontSize);
        }
      }

      this.layer.draw();
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

    async loadWebFont() {
      if (!this.localPreset.webfont) {
        return;
      }
      return new Promise(resolve => {
        WebFont.load({
          ...this.localPreset.webfont,
          active: () => {
            return resolve(this.localPreset.webfont);
          },
        });
      });
    },

    syncPreset() {
      const localPreset = this.$storage.get(this.presetKey);
      this.localPreset = localPreset || this.preset;
    },

    handleLayerClick(evt) {
      this.clearTransformers();

      if (evt.target.name() === 'textOverlay') {
        this.addTransformer(evt.target);
      }
    },

    handleDocumentClick(evt) {
      if (evt.target.nodeName === 'CANVAS') {
        return;
      }
      this.clearTransformers();
    },

    handleTextTransform(evt) {
      const textNode = evt.currentTarget;
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
      this.localPreset.text = textNode.attrs;
    },
  },
};
</script>
