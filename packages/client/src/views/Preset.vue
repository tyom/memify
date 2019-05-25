<template>
  <v-layout align-center>
    <v-flex shrink fill-height>
      <Drawer
        :preset="$store.state.preset"
        @save="$store.dispatch('SAVE_TO_CLOUD')"
      />
    </v-flex>
    <v-flex d-flex fill-height>
      <v-layout column>
        <router-view />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Drawer from '../components/Drawer';

export default {
  components: {
    Drawer,
  },
  async created() {
    return this.$store.dispatch('INIT_PRESET', this.$route.params.presetId);
  },
};
</script>
