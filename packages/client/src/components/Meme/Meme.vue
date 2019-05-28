<template>
  <v-layout column>
    <Toolbar
      :meme="meme"
      :has-changed="hasChanged"
      @render="$emit('render', meme)"
      @restore="$emit('restore', meme.id)"
      @save="$emit('save', meme)"
      @update:caption="handleUpdateCaption"
    />
    <v-layout
      column
      align-center
      justify-center
      pa-4
    >
      <div v-if="!meme.id" style="width: 50%">
        <v-text-field
          :value="meme.title"
          label="Title"
          @change="handleTitleUpdate"
        />
        <v-text-field
          :value="meme.image.src"
          label="Image URL"
          @change="handleImageSettingsUpdate"
        />
      </div>
      <Stage
        :meme="meme"
        @update="$emit('update', $event)"
      />
    </v-layout>
  </v-layout>
</template>

<script>
import { merge } from 'lodash';
import Toolbar from './Toolbar';
import Stage from './Stage';

export default {
  components: {
    Toolbar,
    Stage,
  },
  props: {
    meme: {
      type: Object,
      default: () => ({}),
    },
    hasChanged: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleUpdateCaption(captionAttrs) {
      const updatedMeme = {
        ...this.meme,
        image: this.meme.image,
        caption: {
          ...this.meme.caption,
          ...captionAttrs,
        },
      };

      if (captionAttrs.fontFamily) {
        updatedMeme.webfont = {
          google: {
            families: [captionAttrs.fontFamily],
          },
        };
      }

      this.$emit('update', updatedMeme);
    },
    handleTitleUpdate(title) {
      const updatedMeme = merge(this.meme, {
        title,
      });
      this.$emit('update', updatedMeme);
    },
    handleImageSettingsUpdate(src) {
      const updatedMeme = merge(this.meme, {
        image: {
          src,
        },
      });
      this.$emit('update', updatedMeme);
    },
  },
};
</script>
