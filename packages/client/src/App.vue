<template>
  <v-app dark>
    <v-container
      fluid
      fill-height
      pa-0
    >
      <router-view />
    </v-container>
  </v-app>
</template>

<script>
export default {
  created() {
    return this.$store.dispatch('INIT_APP');
  },
};
</script>

<style>
html {
  background-color: #303030;
}

.v-toolbar .v-toolbar__content {
  padding: 0 20px;
}
</style>
