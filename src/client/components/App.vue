<template>
  <v-app dark>
    <v-container
      fluid
      fill-height
      pa-0
    >
      <v-layout align-center>
        <v-flex
          v-if="hasValidPreset"
          shrink
          fill-height
        >
          <Drawer :presets="localPresets" />
        </v-flex>
        <v-flex
          v-if="hasValidPreset"
          d-flex
          fill-height
        >
          <v-layout column>
            <Toolbar @render="handleRender" />
            <v-flex
              d-flex
              align-center
              align-self-center
            >
              <Stage v-if="selectedPreset" />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-else>
          <PresetGrid v-if="isValidPresetUrl" :cards="localPresets" />
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
  computed: {
    isValidPresetUrl() {
      return isValidUrl(this.$route.query.presetUrl || '');
    },
    hasValidPreset() {
      return this.isValidPresetUrl && this.presetKey;
    },
    presetKey() {
      return this.$route.params.preset;
    },
    presetUrl() {
      return this.$route.query.presetUrl;
    },
    selectedPreset() {
      return (
        this.$store.state.selectedPreset &&
        this.$store.state.selectedPreset.content
      );
    },
    localPresets() {
      return this.$store.state.presets;
    },
  },
  watch: {
    $route: {
      immediate: true,
      async handler() {
        if (this.isValidPresetUrl && !this.localPresets) {
          await this.$store.dispatch('FETCH_PRESETS', this.presetUrl);
        }
        if (
          !this.selectedPreset ||
          this.selectedPreset.key !== this.presetKey
        ) {
          return this.$store.dispatch('SELECT_PRESET', this.presetKey);
        }
      },
    },
  },
  mounted() {},
  methods: {
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
