<template>
  <v-layout align-center>
    <v-flex shrink fill-height>
      <Drawer
        v-if="memeId"
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
  computed: {
    presetId() {
      return this.$route.params.presetId;
    },
    memeId() {
      return this.$route.params.memeId;
    }
  },
  async created() {
    return this.$store.dispatch('INIT_PRESET', this.presetId);
  },
};
</script>
