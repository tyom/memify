<template>
  <v-list class="actions">
    <v-list-tile @click="$emit('export')">
      <v-tooltip right :disabled="expanded">
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
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    expanded: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      exportDialog: false,
    };
  },
};
</script>
