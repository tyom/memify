<template>
  <v-flex d-flex>
    <v-flex
      d-flex
      sm6
      lg4
    >
      <v-overflow-btn
        :items="$store.state.fontFamilies"
        :value="caption.fontFamily"
        height="30"
        flat
        editable
        hide-details
        label="Font family"
        class="font-family"
        @change="handleCaptionUpdate({ fontFamily: $event })"
      />
      <v-overflow-btn
        :items="fontSizes"
        :value="caption.fontSize"
        height="30"
        class="font-sizes"
        hide-details
        label="Font size"
        @change="handleCaptionUpdate({ fontSize: $event })"
      />
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat v-on="on">
            <v-icon>format_color_fill</v-icon>
          </v-btn>
        </template>

        <compact-colour-picker
          :value="caption.fill"
          @input="handleCaptionUpdate({ fill: $event.hex })"
        />
      </v-menu>
    </v-flex>
    <v-flex>
      <v-text-field
        :value="caption.text"
        autofocus
        flat
        solo-inverted
        hide-details
        label="Caption"
        @input="handleCaptionUpdate({ text: $event })"
      />
    </v-flex>
  </v-flex>
</template>

<script>
import { Compact } from 'vue-color';

export default {
  components: {
    'compact-colour-picker': Compact,
  },
  props: {
    caption: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
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
  methods: {
    handleCaptionUpdate(values = {}) {
      this.$emit('update:caption', { ...this.caption, ...values });
    },
  },
};
</script>

<style>
.font-sizes {
  min-width: 9rem;
  max-width: 15rem;
}

.font-family .v-input__append-inner {
  border: 0 !important;
}
</style>
