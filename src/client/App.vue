<template>
  <div class="App">
    <Toolbar
      :presets="presets"
      :initial-text="$route.query.text"
      @input="handleTextInput"
    />
    <main>
      <Stage
        :preset="selectedPreset"
        :text="$route.query.text"
        ref="stage"
      />
    </main>
  </div>
</template>

<script>
import presets from '../presets';
import Toolbar from './Toolbar';
import Stage from './Stage';

export default {
  components: {
    Toolbar,
    Stage,
  },
  data() {
    return {
      presets,
      fontLoaded: false,
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
    updateStage() {
      console.log(this.$refs.stage);
    }
  },
};
</script>

<style>
.App {
  font: 16px Helvetica, sans-serif;
  background-color: #222;
  color: #fff;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
