<template>
  <v-flex d-flex>
    <v-flex d-flex sm6>
      <v-overflow-btn
        :items="$store.state.fontFamilies"
        :value="caption.fontFamily"
        editable
        hide-details
        label="Font family"
        @change="$emit('update:caption', { ...caption, fontFamily: $event })"
      />
      <v-overflow-btn
        :items="fontSizes"
        :value="caption.fontSize"
        class="font-sizes"
        hide-details
        label="Font size"
        @change="$emit('update:caption', { ...caption, fontSize: $event })"
      />
    </v-flex>
    <v-flex pa-2>
      <v-text-field
        :value="caption.text"
        autofocus
        flat
        solo-inverted
        hide-details
        label="Caption"
        @input="$emit('update:caption', { ...caption, text: $event })"
      />
    </v-flex>
  </v-flex>
</template>

<script>
export default {
  props: {
    caption: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectedFontSize: this.caption.fontSize,
      selectedFontFamily: this.caption.fontFamily,
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
