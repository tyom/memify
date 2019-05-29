<template>
  <div :class="{ loaded: loaded }" class="Stage"></div>
</template>

<script>
import Konva from 'konva';
import { isEqual, debounce, merge } from 'lodash';
import { createStageComponents, populateLayer, createImage } from '../../konva';
import { loadWebFont } from '../../utils';

export default {
  props: {
    meme: {
      type: Object,
      default: () => ({}),
    },
    snapshot: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      loaded: false,
      stage: null,
      layer: null,
      caption: null,
    };
  },
  watch: {
    meme: {
      deep: true,
      async handler(meme, prevMeme) {
        const isNextFontFamily = !isEqual(meme.webfont, prevMeme.webfont);
        const isNextMeme = meme.id !== prevMeme.id;

        if (isNextMeme) {
          await this.buildStage();
        }
        this.updateStage(isNextFontFamily);
      },
    },
    'meme.image.src'() {
      return this.buildStage();
    },
    '$route.query'() {
      this.updateCaption();
    }
  },
  async mounted() {
    await this.buildStage();
  },
  methods: {
    async updateStage(reloadFont = false) {
      if (reloadFont) {
        await loadWebFont(this.meme.webfont);
      }
      this.updateCaption(this.meme.caption);
    },
    async buildStage() {
      this.loaded = false;

      await loadWebFont(this.meme.webfont);

      const { stage, layer, caption } = await createStageComponents({
        el: this.$el,
        meme: this.meme,
        isSnapshot: this.snapshot,
      });

      this.stage = stage;
      this.layer = layer;
      this.caption = caption;

      const composedLayer = await this.buildLayer(this.meme);
      this.stage.add(composedLayer);

      if (!this.snapshot) {
        this.setUpEvents();
      }

      this.fitStageToScreen();
      this.updateCaption({
        ...this.meme.caption,
      });

      const layerImage = this.layer.find('Image')[0];

      if (layerImage && !(this.meme.image.width || this.meme.image.height)) {
        this.stage.width(layerImage.getWidth());
        this.stage.height(layerImage.getHeight());
      }

      this.loaded = true;
    },

    async buildLayer(meme = {}) {
      let image;
      let overlayImage;
      try {
        image = await createImage({
          ...meme.image,
          name: 'image',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Failed to load image: '${meme.image.src}'`);
      }

      try {
        overlayImage = await createImage({
          ...(meme.overlayImage || {}),
          name: 'overlay',
          listening: false,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Failed to load overlay image:'${meme.overlayImage.src}'`);
      }

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

    updateCaption({ fontSize, ...otherAttrs } = this.meme.caption) {
      if (!this.caption) {
        return;
      }
      const { text } = this.$route.query;
      const captionFontSize =
        fontSize === 'auto' ? this.getAutoFontSize(text) : fontSize;

      this.caption.setAttrs({
        ...otherAttrs,
        fontSize: captionFontSize,
      });

      if (!this.snapshot) {
        this.caption.setAttrs({
          text,
        });
      }

      this.layer.draw();
    },

    emitUpdate() {
      this.$emit(
        'update',
        merge({}, this.meme, {
          caption: this.caption.attrs,
        })
      );
    },

    getAutoFontSize(text) {
      const box = this.caption.getClientRect();
      const textLines = this.caption.textArr;

      if (textLines.length === 0) {
        return;
      }
      const { minFontSize = 12, maxFontSize = 60 } = this.caption;
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
