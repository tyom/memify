<template>
  <v-toolbar
    dense
    flat
    color="rgba(255, 255, 255, 0.04)"
  >
    <v-layout row class="CaptionControl">
      <v-flex
        d-flex
        shrink
        align-items="center"
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
          class="font-sizes ml-2"
          @change="handleCaptionUpdate({ fontSize: $event })"
        />
      </v-flex>
      <v-flex
        d-flex
        px-2
        shrink
      >
        <v-divider vertical />
        <v-flex d-flex>
          <v-menu transition="slide-y-transition" bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                v-on="on"
                class="control-btn"
              >
                <v-icon :color="caption.fill">
                  format_color_fill
                </v-icon>
              </v-btn>
            </template>
            <compact-colour-picker
              :value="fillColour"
              @input="handleCaptionUpdate({ fill: $event.hex })"
            />
          </v-menu>
        </v-flex>
        <v-divider vertical />
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
        <v-divider vertical />
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
      <v-flex grow>
        <v-text-field
          :value="captionText"
          autofocus
          flat
          clearable
          solo-inverted
          hide-details
          label="Caption"
          @input="handleCaptionText"
        />
      </v-flex>
    </v-layout>
  </v-toolbar>
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
  computed: {
    fillColour() {
      return this.caption.fill || '#fff';
    },
    captionText() {
      return this.$route.query.text;
    }
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
    handleCaptionText(text) {
      return this.$store.dispatch('UPDATE_CAPTION_TEXT', text);
    }
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

.vc-compact {
  background-color: #444 !important;
}
.vc-compact-color-item {
  margin-top: 1px;
  margin-left: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3) !important;
}
</style>
