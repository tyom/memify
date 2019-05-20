<template>
  <v-layout>
    <v-flex
      xs12
      sm6
      offset-sm3
    >
      <v-card>
        <v-card-title primary-title>
          <h3 class="headline mb-10">
            Select images preset
          </h3>
        </v-card-title>

        <v-card-text>
          <p>
            Memify works with presets. Each preset contains an image, overlay
            text and optional foreground image, which is overlayed on top of
            main image and text. This can be used to add effects, such as
            shades.
          </p>

          <v-form
            ref="form"
            @submit.prevent="handlePresetUrl"
            lazy-validation
          >
            <v-layout>
              <v-flex>
                <v-text-field
                  v-model="presetUrl"
                  :rules="urlRules"
                  flat
                  solo-inverted
                  required
                  label="Preset URL (returns JSON)"
                />
              </v-flex>
              <v-flex shrink>
                <v-btn type="submit" color="primary">
                  Load preset
                </v-btn>
              </v-flex>
            </v-layout>
            <p class="example-url">
              e.g.
              <a :href="examplePresetUrl" @click.prevent="handleExampleLink">
                {{ examplePresetUrl }}
              </a>
            </p>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-dialog scrollable max-width="80vw">
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                small
                v-on="on"
                @click="handleShowExample"
              >
                Show example preset
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <h2 class="headline">
                  Example preset JSON
                </h2>
              </v-card-title>
              <v-divider />
              <v-card-text>
                <pre v-if="presetExampleData">{{ presetExampleData }}</pre>
                <v-progress-linear v-else :indeterminate="true" />
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { isValidUrl } from '../../utils';

export default {
  data() {
    return {
      presetUrl: this.$route.query.presetUrl || '',
      examplePresetUrl: 'https://api.npoint.io/2f966781e0441822585d',
      presetExampleData: '',
      urlRules: [
        v => !!v || 'URL is required',
        v => isValidUrl(v) || 'URL is invalid',
      ],
    };
  },
  computed: {
    isValidPresetUrl() {
      return isValidUrl(this.presetUrl);
    },
  },
  methods: {
    handlePresetUrl() {
      if (this.$refs.form.validate()) {
        this.$router.push({ query: { presetUrl: this.presetUrl } });
      }
    },
    handleShowExample() {
      fetch(this.examplePresetUrl)
        .then(res => res.json())
        .then(data => {
          this.presetExampleData = data;
        });
    },
    handleExampleLink(evt) {
      this.presetUrl = evt.target.href;
    }
  },
};
</script>

<style scoped>
.example-url a {
  color: #fff;
}
</style>
