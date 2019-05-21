<template>
  <v-app dark>
    <v-container
      fluid
      fill-height
      pa-0
    >
      <v-layout align-center>
        <v-flex
          shrink
          fill-height
          v-if="presetSelected"
        >
          <Drawer :presets="presets" />
        </v-flex>
        <v-flex
          d-flex
          fill-height
          v-if="presetSelected"
        >
          <v-layout column>
            <v-flex shrink>
              <Toolbar
                :text="$route.query.text"
                :presets="presets"
                @render="handleRender"
                @text-input="handleTextInput"
              />
            </v-flex>
            <v-flex
              d-flex
              align-center
              align-self-center
            >
              <Stage
                v-if="selectedPreset"
                :preset.sync="selectedPreset"
                :preset-key="presetKey"
                :text="caption"
              />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-else>
          <PresetGrid v-if="isValidPresetUrl" :cards="presets" />
          <PresetSelection v-else />
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { isValidUrl } from '../../utils';
import Toolbar from './Toolbar';
import PresetSelection from './PresetSelection';
import Stage from './Stage';
import Drawer from './Drawer';
import PresetGrid from './PresetGrid';

export default {
  components: {
    Toolbar,
    Stage,
    PresetSelection,
    Drawer,
    PresetGrid,
  },
  data() {
    return {
      presets: this.$storage.get('presets'),
      selectedPreset: null,
    };
  },
  computed: {
    isValidPresetUrl() {
      return isValidUrl(this.$route.query.presetUrl || '');
    },
    presetSelected() {
      return this.isValidPresetUrl && this.presetKey;
    },
    presetKey() {
      return this.$route.params.preset;
    },
    caption() {
      return this.$route.query.text;
    },
  },
  watch: {
    $route: {
      immediate: true,
      async handler(route) {
        const { presetUrl } = route.query;
        const { preset } = route.params;
        const localPresets = this.$storage.get('presets');
        if (!presetUrl) {
          return;
        }
        try {
          this.presets =
            localPresets && localPresets[preset]
              ? localPresets
              : await fetch(presetUrl).then(res => res.json());
          this.selectedPreset = this.presets[preset];
        } catch (error) {
          throw new Error('Failed to get preset data from the URL');
        }
      },
    },
    selectedPreset(preset) {
      if (!this.presetKey) {
        return;
      }
      this.presets = { ...this.presets, [this.presetKey]: preset };
    },
    presets(presets) {
      this.$storage.set('presets', presets);
    },
  },
  methods: {
    handleTextInput(value) {
      this.$router.replace({
        name: 'preset',
        params: { preset: this.$route.params.preset },
        query: {
          ...this.$route.query,
          text: value,
        },
      });
    },
    handleRender() {
      window.location.href = this.$router
        .resolve(this.$route)
        .href.replace('#', '/r');
    },
  },
};
</script>

<style>
html {
  background-color: #303030;
}

.v-toolbar .v-toolbar__content {
  padding: 0 20px;
}
</style>
