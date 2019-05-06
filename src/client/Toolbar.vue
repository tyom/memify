<template>
  <v-toolbar app dense>
    <PresetMenu v-slot:default="{ on }" :presets="presets">
      <v-toolbar-side-icon v-on="on" />
    </PresetMenu>
    <v-form @submit.prevent="$emit('render')" grow>
      <v-layout>
        <v-flex>
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
          <v-btn type="submit" flat>
            Render
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-toolbar>
</template>

<script>
import PresetMenu from './PresetMenu';

export default {
  components: {
    PresetMenu,
  },
  props: {
    presets: {
      type: Object,
      default: () => ({}),
    },
    text: {
      type: String,
      default: '',
    },
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
  margin: 6px !important;
}

.v-list__tile.v-list__tile--avatar {
  height: 70px;
}

.v-list__tile__content {
  padding-left: 8px;
}

.primary--text.v-list__tile--active {
  background-color: #0006 !important;
  color: #fff !important;
}
</style>
