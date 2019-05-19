<template>
  <v-app dark>
    <Toolbar
      v-if="preset"
      :text="$route.query.text"
      :preset="preset"
      @render="handleRender"
      @text-input="handleTextInput"
    />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <template v-if="isValidPresetUrl">
          <Stage
            v-if="selectedPreset"
            :preset="selectedPreset"
            :preset-key="$route.params.preset"
            :text="$route.query.text"
          />
          <PresetMenu
            v-else-if="!$route.params.preset"
            v-slot:default="{ on }"
            :preset="preset"
          >
            <v-btn v-on="on">
              Select preset item
            </v-btn>
          </PresetMenu>
        </template>
        <PresetSelection v-else />
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { isValidUrl } from '../utils';
import Toolbar from './Toolbar';
import PresetMenu from './PresetMenu';
import PresetSelection from './PresetSelection';
import Stage from './Stage';

export default {
  components: {
    Toolbar,
    Stage,
    PresetMenu,
    PresetSelection,
  },
  data() {
    return {
      preset: null,
    };
  },
  computed: {
    isValidPresetUrl() {
      return isValidUrl(this.$route.query.presetUrl || '');
    },
    selectedPreset() {
      if (!this.preset) {
        return;
      }
      const presetKey = this.$route.params.preset;
      return this.preset[presetKey];
    },
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler({ presetUrl }) {
        if (!presetUrl) {
          return;
        }
        fetch(presetUrl)
          .then(res => res.json())
          .then(data => {
            this.preset = data;
          });
      },
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
</style>
