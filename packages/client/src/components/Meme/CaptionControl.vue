<template>
  <v-flex d-flex class="CaptionControl">
    <v-flex
      d-flex
      align-items="center"
      lg3
    >
      <v-overflow-btn
        :items="$store.state.fontFamilies"
        :value="caption.fontFamily"
        height="36"
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
        height="36"
        hide-details
        label="Font size"
        class="font-sizes"
        @change="handleCaptionUpdate({ fontSize: $event })"
      />
    </v-flex>
    <v-flex
      d-flex
      px-2
      lg3
    >
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            flat
            v-on="on"
            class="control-btn"
          >
            <v-icon>format_color_fill</v-icon>
          </v-btn>
        </template>
        <compact-colour-picker
          :value="caption.fill"
          @input="handleCaptionUpdate({ fill: $event.hex })"
        />
      </v-menu>
      <v-btn-toggle
        dark
        :value="caption.align"
        @change="handleCaptionUpdate({ align: $event })"
      >
        <v-btn
          flat
          class="control-btn"
          value="left"
        >
          <v-icon>format_align_left</v-icon>
        </v-btn>
        <v-btn
          flat
          class="control-btn"
          value="center"
        >
          <v-icon>format_align_center</v-icon>
        </v-btn>
        <v-btn
          flat
          class="control-btn"
          value="right"
        >
          <v-icon>format_align_right</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle
        dark
        :value="caption.verticalAlign"
        @change="handleCaptionUpdate({ verticalAlign: $event })"
      >
        <v-btn
          flat
          class="control-btn"
          value="top"
        >
          <v-icon>vertical_align_top</v-icon>
        </v-btn>
        <v-btn
          flat
          class="control-btn"
          value="middle"
        >
          <v-icon>vertical_align_center</v-icon>
        </v-btn>
        <v-btn
          flat
          class="control-btn"
          value="bottom"
        >
          <v-icon>vertical_align_bottom</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-flex>
    <v-flex lg8>
      <v-text-field
        :value="caption.text"
        autofocus
        flat
        clearable
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
.CaptionControl .font-sizes {
  min-width: 9rem;
  max-width: 15rem;
}

.CaptionControl .control-btn {
  height: auto;
  min-width: 0 !important;
  margin: 0 !important;
}

.CaptionControl .font-family .v-input__append-inner {
  border: 0 !important;
}

.CaptionControl .v-btn-toggle {
  background-color: transparent !important;
  justify-content: center;
}
</style>
