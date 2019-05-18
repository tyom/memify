<template>
  <div class="Stage" ref="stage"></div>
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
    '$route.params.preset': {
      handler() {
        this.buildStage();
      },
    },
    text: {
      handler(value) {
        this.updateCaption(value);
      },
    },
  },
  mounted() {
    this.buildStage();
    window.addEventListener('click', evt => {
      if (evt.target.nodeName === 'CANVAS') {
        return;
      }
      this.clearTransformers();
    });
  },
  methods: {
    async buildStage() {
      const textConfig = {
        ...this.preset.text,
        fontSize:
          this.preset.text.fontSize === 'auto'
            ? this.preset.text.minFontSize || 12
            : this.preset.text.fontSize,
      };
      this.stage = new Konva.Stage({
        container: this.$refs.stage,
        width: this.preset.bgr.width,
        height: this.preset.bgr.height,
      });
      this.layer = new Konva.Layer();
      this.caption = new Konva.Text({
        ...textConfig,
        name: 'textOverlay',
        draggable: true,
      });

      await this.loadWebFont();

      const bgrImage = await this.addImage({
        ...this.preset.bgr,
        name: 'backgroundImage',
      });
      const fgrImage = await this.addImage({
        ...this.preset.fgr,
        name: 'foregroundImage',
        listening: false,
      });

      this.layer.add(bgrImage);
      this.layer.add(this.caption);
      fgrImage && this.layer.add(fgrImage);
      this.stage.add(this.layer);

      this.updateCaption(this.text);

      this.layer.on('click tap', this.handleLayerClick);
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

      if (this.preset.text.fontSize === 'auto') {
        const box = this.caption.getClientRect();
        const textLines = this.caption.textArr;

        if (textLines.length === 1) {
          const { minFontSize = 12, maxFontSize = 60 } = this.preset.text;
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
      this.layer.add(transformer);
      transformer.attachTo(shape);
      this.layer.draw();
    },

    handleLayerClick(evt) {
      this.clearTransformers();

      if (evt.target.name() === 'textOverlay') {
        this.addTransformer(evt.target);
      }
    },

    async loadWebFont() {
      if (!this.preset.webfont) {
        return;
      }
      return new Promise(resolve => {
        WebFont.load({
          ...this.preset.webfont,
          active: () => {
            return resolve(this.preset.webfont);
          },
        });
      });
    },
  },
};
</script>
