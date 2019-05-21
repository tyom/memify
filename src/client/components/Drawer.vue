<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    class="preset-drawer"
    absolute
    dark
    temporary
  >
    <v-list class="pa-1">
      <v-list-tile v-if="mini" @click.stop="mini = !mini">
        <v-list-tile-action>
          <v-icon>chevron_right</v-icon>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile tag="div" @click="exportDialogue = !exportDialogue">
        <v-tooltip right :disabled="!mini">
          <template v-slot:activator="{ on }">
            <v-list-tile-action v-on="on">
              <v-icon>save_alt</v-icon>
            </v-list-tile-action>
          </template>
          <span>Export preset as JSON</span>
        </v-tooltip>

        <v-list-tile-content>
          <v-list-tile-title>Export preset as JSON</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action shrink>
          <v-btn
            small
            icon
            @click.stop="mini = !mini"
          >
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <v-list class="presets pt-0">
      <v-divider light />

      <v-list-tile
        avatar
        v-for="item in presetItems"
        :key="item.title"
        :to="{
          name: 'preset',
          params: { preset: item.key },
          query: $route.query,
        }"
      >
        <v-tooltip right :disabled="!mini">
          <template v-slot:activator="{ on }">
            <v-list-tile-avatar
              v-on="on"
              tile
              size="56"
            >
              <v-img :src="item.thumbUrl" />
            </v-list-tile-avatar>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-dialog
      v-model="exportDialogue"
      scrollable
      max-width="80vw"
    >
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
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: null,
    },
    presets: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      drawer: this.show,
      exportDialogue: false,
      mini: true,
    };
  },
  computed: {
    presetItems() {
      return Object.entries(this.presets).map(([key, content]) => ({
        key,
        title: content.name,
        thumbUrl: content.bgr.url,
      }));
    },
  },
  watch: {
    show(value) {
      this.drawer = value;
    },
    drawer(value) {
      this.$emit('update:show', value);
    },
  },
};
</script>

<style>
.presets .v-list__tile.v-list__tile--avatar {
  height: 70px;
}

.preset-drawer .v-list__tile__content {
  padding-left: 16px;
}

.preset-drawer .v-icon {
  margin: auto;
}

.presets .primary--text.v-list__tile--active {
  background-color: #000a !important;
  color: #fff !important;
}

.presets .v-list__tile--active .v-image {
  box-shadow: 0 0 0 1px #fff6;
}
</style>
