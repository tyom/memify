<template>
  <v-toolbar app dense>
    <v-toolbar-side-icon @click="$emit('click-menu')" />
    <v-form @submit.prevent="$emit('render')">
      <v-layout>
        <v-flex px-2>
          <v-text-field
            :value="text"
            @input="$emit('text-input', $event)"
            autofocus
            flat
            solo-inverted
            hide-details
            label="Overlay text"
          />
        </v-flex>
        <v-flex shrink>
          <v-btn
            type="submit"
            flat
            title="Capture"
            aria-label="capture"
          >
            <v-icon>photo_camera</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
    presets: {
      type: Object,
      default: () => ({}),
    },
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    handlePresetToggle() {
      this.expanded = !this.expanded;
    },
    handlePresetSelection(key) {
      this.$router.push({
        name: 'preset',
        params: { preset: key },
        query: this.$route.query,
      });
    },
  },
};
</script>

<style>
.v-form {
  flex: 1;
}

.v-input__control {
  min-height: 36px !important;
  margin-top: 6px !important;
  margin-bottom: 6px !important;
}
</style>
