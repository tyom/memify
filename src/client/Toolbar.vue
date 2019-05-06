<template>
  <v-toolbar app dense>
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-toolbar-side-icon v-on="on" />
      </template>
      <v-list subheader>
        <v-subheader>Preset items</v-subheader>
        <v-list-tile
          v-for="(preset, key) in presets"
          :key="key"
          :to="{ name: 'preset', params: { preset: key }, query: $route.query }"
          avatar
        >
          <v-list-tile-avatar tile size="56">
            <v-img :src="preset.bgr.url" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="preset.name" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
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
export default {
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
