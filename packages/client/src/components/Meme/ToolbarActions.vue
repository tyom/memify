<template>
  <v-toolbar
    dense
    flat
    class="Toolbar"
  >
    <h2>{{ title }}</h2>
    <v-spacer />

    <template v-if="memeId !== 'snapshot'">
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
    </template>

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
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    memeId: {
      type: String,
      default: '',
    },
    hasChanged: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
