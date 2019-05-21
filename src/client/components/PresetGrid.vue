<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex
        v-for="(card, key) in cards"
        :key="card.key"
        offset-sm3
        sm6
        xs12
      >
        <v-card
          flat
          tile
          hover
          :to="{
            name: 'preset',
            params: { preset: key },
            query: $route.query,
          }"
        >
          <v-img :src="card.bgr.url" height="200px" />
          <v-container
            fill-height
            fluid
            pa-2
          >
            {{ card.name }}
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    cards: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
