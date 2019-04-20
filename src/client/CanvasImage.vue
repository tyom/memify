<template>
  <v-image
    :config="{ image, name, width, height, src, listening, draggable }"
  />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    inert: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      image: null,
      listening: this.draggable && !this.inert,
    };
  },
  watch: {
    src: {
      immediate: true,
      handler(value) {
        const image = new window.Image();
        image.src = value;
        image.onload = () => {
          this.image = image;
        };
      },
    },
  },
  created() {
    this.setImage();
  },
  updated() {
    this.setImage();
  },
  methods: {
    setImage() {},
  },
};
</script>
