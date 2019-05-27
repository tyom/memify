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
    <v-flex
      d-flex
      pa-3
      align-center
      align-self-center
    >
      <Stage :meme="meme" @update:caption="$emit('update:caption', $event)" />
    </v-flex>
  </v-layout>
</template>

<script>
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
    captionText: {
      type: String,
      default: '',
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
        caption: {
          ...this.meme.caption,
          ...captionAttrs,
        },
      };

      if (this.meme.webfont) {
        updatedMeme.webfont = {
          ...this.meme.webfont,
          google: {
            families: [captionAttrs.fontFamily],
          },
        }
      }

      this.$emit('update:caption', updatedMeme);
    },
  },
};
</script>
