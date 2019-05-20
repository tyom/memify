<template>
  <v-toolbar app dense>
    <PresetMenu v-slot:default="{ on }" :presets="presets">
      <v-toolbar-side-icon v-on="on" />
    </PresetMenu>
    <v-form @submit.prevent="$emit('render')" grow>
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
          <v-btn type="submit" flat>
            <v-icon>photo_camera</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-dialog scrollable max-width="80vw">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          type="submit"
          flat
        >
          <v-icon>save_alt</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h2 class="headline">
            Export preset as JSON
          </h2>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <pre>{{ JSON.stringify(presets, null, 2) }}</pre>
        </v-card-text>
      </v-card>
    </v-dialog>
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
