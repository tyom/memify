<template>
  <div>
    <v-stage
      ref="stage"
      class="Composer"
      :config="stageConfig"
      @click="handleStageMouseDown"
    >
      <v-layer>
        <CanvasImage
          :src="preset.bgr.url"
          :width="preset.bgr.width"
          :height="preset.bgr.height"
        />
        <v-text
          ref="textLayer"
          :config="{
            text: fontLoaded ? text : '',
            draggable: true,
            name: 'text',
            ...preset.text,
          }"
        />
        <CanvasImage
          v-if="preset.fgr"
          :src="preset.fgr.url"
          :width="preset.fgr.width"
          :height="preset.fgr.height"
        />
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import WebFont from 'webfontloader';
import CanvasImage from './CanvasImage';

export default {
  components: {
    CanvasImage,
  },
  props: {
    preset: {
      type: Object,
      default: () => ({
        bgr: {
          width: 600,
          height: 450,
        },
      }),
    },
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      stageConfig: {},
      textConfig: {},
      selectedShapeName: '',
      webFontLoaded: false,
    };
  },
  watch: {
    '$route.params.preset': {
      immediate: true,
      handler() {
        this.stageConfig.height = this.preset.bgr.height;
        this.stageConfig.width = this.preset.bgr.width;
        this.handleWebFont();
      },
    },
  },
  computed: {
    fontLoaded() {
      return this.preset.webfont ? this.webFontLoaded : true;
    }
  },
  mounted() {
    window.addEventListener('click', evt => {
      if (evt.target.nodeName === 'CANVAS') {
        return;
      }
      this.selectedShapeName = '';
      this.updateTransformer();
    });
  },
  methods: {
    handleWebFont() {
      if (!this.preset.webfont) {
        this.webFontLoaded = false;
        return;
      }

      WebFont.load({
        ...this.preset.webfont,
        active: () => {
          this.webFontLoaded = true;
          const text = this.$refs.textLayer.getNode();
          text.text(this.text);
          text.draw();
        },
      });
    },
    handleStageMouseDown(evt) {
      // Clicked on stage - clear selection
      if (!evt.target.draggable() || evt.target === evt.target.getStage()) {
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }

      const isTransformer = evt.target.getParent().className === 'Transformer';
      if (isTransformer) {
        return;
      }

      this.selectedShapeName = evt.target.name();
      this.updateTransformer();
    },
    updateTransformer() {
      if (!this.$refs.transformer) {
        return;
      }
      const transformer = this.$refs.transformer.getStage();
      const stage = transformer.getStage();
      const selectedNode = stage.findOne(`.${this.selectedShapeName}`);

      // transformer is already attached
      if (selectedNode === transformer.node()) {
        return;
      }

      // attach transformer to selected node
      if (selectedNode) {
        transformer.attachTo(selectedNode);
      } else {
        transformer.detach();
      }

      transformer.getLayer().batchDraw();
    },
  },
};
</script>
