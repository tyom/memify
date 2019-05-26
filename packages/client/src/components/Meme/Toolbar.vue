<template>
  <div class="Toolbar">
    <v-toolbar
      dense
      flat
      class="Toolbar"
    >
      <h2>{{ meme.title }}</h2>
      <v-spacer />

      <v-tooltip bottom v-if="hasChanged">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            flat
            aria-label="save edits to cloud"
            @click="$emit('save')"
          >
            <v-icon left>
              cloud_upload
            </v-icon>
            Save
          </v-btn>
        </template>
        <span>Save edits</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            flat
            aria-label="restore edits from cloud"
            @click="$emit('restore')"
          >
            <v-icon left>
              cloud_download
            </v-icon>
            Restore
          </v-btn>
        </template>
        <span>Restore edits</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            flat
            aria-label="render image"
            @click="$emit('render')"
          >
            <v-icon left>
              photo_camera
            </v-icon>
            Render
          </v-btn>
        </template>
        <span>Render image</span>
      </v-tooltip>
    </v-toolbar>

    <v-divider />

    <v-toolbar
      dense
      flat
      color="rgba(255, 255, 255, 0.04)"
    >
      <CaptionControl
        :caption="meme.caption"
        @update:caption="$emit('update:caption', $event)"
      />
    </v-toolbar>
  </div>
</template>

<script>
import CaptionControl from './CaptionControl';

export default {
  components: {
    CaptionControl,
  },
  props: {
    meme: {
      type: Object,
      required: true,
    },
    hasChanged: {
      type: Boolean,
      default: false,
    },
  },
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

.Toolbar .v-toolbar__extension {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.02);
}
</style>
