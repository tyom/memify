<template>
  <v-toolbar dense flat>
    <CaptionControl :caption="caption" />
    <v-btn
      type="submit"
      flat
      title="Capture"
      aria-label="capture"
      @click="$emit('render')"
    >
      <v-icon>photo_camera</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import CaptionControl from './CaptionControl';

export default {
  components: {
    CaptionControl,
  },
  computed: {
    caption() {
      return this.$route.query.text;
    }
  }
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
