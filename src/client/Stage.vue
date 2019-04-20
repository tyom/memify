<template>
  <div>
    <link
      v-if="preset.font"
      :href="preset.font.url"
      rel="stylesheet"
      @load="handleFont"
    />
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
      stageConfig: {
        width: this.preset.bgr.width,
        height: this.preset.bgr.height,
      },
      textConfig: {},
      selectedShapeName: '',
      fontLoaded: !this.preset.font,
    };
  },
  watch: {
    '$route.params.preset'() {
      this.$refs.stage.getNode().draw();
    },
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
    handleFont() {
      setTimeout(() => {
        this.fontLoaded = true;
        const text = this.$refs.textLayer.getNode();
        text.text(this.text);
        text.draw();
      }, 100);
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
