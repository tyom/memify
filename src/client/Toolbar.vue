<template>
  <div class="Toolbar">
    <div class="row">
      <button
        type="button"
        class="toggle"
        @click="handlePresetToggle"
      >
        Presets
      </button>
      <form :action="`/r/${$route.params.preset}`">
        <textarea
          autofocus
          class="text-input"
          name="text"
          placeholder="Text overlay"
          :value="initialText"
          @input="$emit('input', $event.target.value)"
        ></textarea>
        <button>Render</button>
      </form>
    </div>
    <div v-if="expanded" class="presets">
      <div class="row">
        <router-link
          v-for="(preset, key) in presets"
          :key="key"
          :to="{ name: 'preset', params: { preset: key }, query: $route.query }"
          class="preset-link"
        >
          {{ preset.name }}
          <img
            v-if="preset.bgr"
            :src="preset.bgr.url"
            class="preset-thumb"
            alt=""
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    presets: {
      type: Object,
      default: () => ({}),
    },
    initialText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      text: '',
      expanded: false,
    };
  },
  methods: {
    handlePresetToggle() {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style scoped>
.Toolbar {
  padding: 10px;
  grid-gap: 10px;
  background-color: #fff3;
  align-items: stretch;
}

.row {
  display: flex;
}

form {
  display: flex;
  margin: 0;
  flex: 1;
}

.text-input,
button {
  padding: 10px;
  font-size: 1em;
}

button:focus {
  position: relative;
}

.text-input {
  flex-grow: 1;
  height: 2.5em;
  color: #333;
  border: 0;
}

.text-input:focus {
  position: relative;
}

button {
  border: 0;
  padding-left: 20px;
  padding-right: 20px;
  text-decoration: none;
  cursor: pointer;
  background-color: #0009;
  color: #fff;
}

.presets {
  margin: 10px 0 0;
  background-color: #0004;
}

.preset-link {
  padding: 10px;
  display: block;
  font-size: 1.2em;
  color: #fff;
  text-decoration: none;
}

.preset-link:hover {
  background-color: #0004;
}

.preset-thumb {
  display: block;
  width: 120px;
  margin-top: 10px;
}

.preset-link.router-link-active {
  background-color: #0009;
}
</style>
