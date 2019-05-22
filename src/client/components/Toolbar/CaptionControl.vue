<template>
  <v-flex d-flex>
    <v-flex d-flex sm6>
      <v-overflow-btn
        v-model="selectedFontFamily"
        :items="$store.state.fontFamilies"
        editable
        hide-details
        label="Font family"
        @change="$store.dispatch('UPDATE_FONT_FAMILY', $event)"
      />
      <v-overflow-btn
        v-model="selectedFontSize"
        :items="fontSizes"
        class="font-sizes"
        hide-details
        label="Font size"
        @change="$store.dispatch('UPDATE_TEXT_OPTIONS', { fontSize: $event })"
      />
    </v-flex>
    <v-flex pa-2>
      <v-text-field
        :value="caption"
        autofocus
        flat
        solo-inverted
        hide-details
        label="Caption"
        @input="$store.dispatch('UPDATE_CAPTION', $event)"
      />
    </v-flex>
  </v-flex>
</template>

<script>
export default {
  props: {
    caption: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedFontSize: null,
      selectedFontFamily: null,
      fontFamilies: [],
      fontSizes: [
        { text: 'auto', value: 'auto' },
        { text: '60', value: 60 },
        { text: '50', value: 50 },
        { text: '40', value: 40 },
        { text: '30', value: 30 },
        { text: '20', value: 20 },
        { text: '15', value: 15 },
      ],
    };
  },
  watch: {
    '$store.state.selectedPreset': {
      immediate: true,
      handler(preset) {
        if (!preset) {
          return;
        }
        this.selectedFontSize = preset.content.text.fontSize;
        this.selectedFontFamily = preset.content.text.fontFamily;
      },
    },
  },
  mounted() {
    return this.$store.dispatch('GET_GOOGLE_FONTS');
  },
};
</script>

<style scoped>
.font-sizes {
  min-width: 9rem;
  max-width: 15rem;
}
</style>
