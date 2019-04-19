<template>
  <div class="Composer">
    <div class="bg-images" v-if="bgImages.length">
      <img
        v-for="image in bgImages"
        :src="image.url"
        :style="image.style"
        alt=""
      />
    </div>
    <div class="text" :style="textStyle">
      {{ text }}
    </div>
    <div class="fg-images" v-if="fgImages.length">
      <img
        v-for="image in fgImages"
        :src="image.url"
        :style="image.style"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bgImages: {
      type: Array,
      default: () => [],
    },
    fgImages: {
      type: Array,
      default: () => [],
    },
    text: {
      type: String,
      default: '',
    },
    textStyle: {
      type: Object,
      default: {},
    },
  },
};
</script>

<style scoped>
.Composer {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.7);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-width: 90vw;
  max-height: 90vh;
}

.fg-images {
  position: absolute;
  top: 0;
  left: 0;
}

.imageContainer img {
  display: block;
  max-height: 100%;
  max-width: 100%;
  width: auto;
}

.text {
  position: absolute;
}
</style>
