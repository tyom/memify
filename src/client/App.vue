<template>
  <v-app dark>
    <Toolbar
      :text="$route.query.text"
      :presets="presets"
      @render="handleRender"
      @text-input="handleTextInput"
    />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <Stage
          v-if="selectedPreset"
          :preset="selectedPreset"
          :text="$route.query.text"
          ref="stage"
        />
        <PresetMenu
          v-else
          v-slot:default="{ on }"
          :presets="presets"
        >
          <v-btn v-on="on">
            Select preset item
          </v-btn>
        </PresetMenu>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import presets from '../presets';
import Toolbar from './Toolbar';
import PresetMenu from './PresetMenu';
import Stage from './Stage';

export default {
  components: {
    Toolbar,
    Stage,
    PresetMenu,
  },
  data() {
    return {
      presets,
    };
  },
  computed: {
    selectedPreset() {
      const presetName = this.$route.params.preset;
      const preset = presets[presetName];
      if (!preset) {
        console.log(`No preset '${presetName}' found`);
      }
      return preset;
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
