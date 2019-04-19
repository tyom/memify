<template>
  <div class="App">
    <form class="input" :action="'/r/' + query.preset">
      <input
        type="text"
        placeholder="Text overlay"
        name="text"
        v-model="text"
      />
      <button>Render</button>
    </form>
    <Composer
      :bg-images="backgroundImages"
      :fg-images="foregroundImages"
      :text="text"
      :text-style="textStyle"
    />
  </div>
</template>

<script>
import { parse, stringify } from 'query-string';
import { PRESETS } from '../constants';
import Composer from './Composer';
const query = parse(window.location.hash.slice(1));

export default {
  components: {
    Composer,
  },
  data() {
    return {
      query,
      text: query.text,
    };
  },
  computed: {
    backgroundImages() {
      try {
        return PRESETS[this.query.preset].bg;
      } catch (e) {
        return [];
      }
    },
    foregroundImages() {
      try {
        return PRESETS[this.query.preset].fg;
      } catch (e) {
        return [];
      }
    },
    textStyle() {
      try {
        return PRESETS[this.query.preset].style;
      } catch (e) {
        return {};
      }
    },
  },
  watch: {
    text(text) {
      const currentQuery = parse(window.location.hash);
      window.location.hash = stringify({ ...currentQuery, text });
    },
  },
  created() {
    window.onhashchange = evt => {
      this.text = parse(evt.newURL.split('#')[1]).text;
    };
  },
};
</script>

<style>
.input {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  margin: auto;
  width: 500px;
  padding: 10px;
  display: flex;
  background-color: #fff5;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.7);
}

input,
button {
  padding: 5px;
  font-size: 1em;
}

input {
  flex-grow: 1;
  color: #333;
  border: 1px solid #ccc;
}

input:focus {
  position: relative;
}

button {
  border: 0;
  padding-left: 10px;
  padding-right: 10px;
  text-decoration: none;
  cursor: pointer;
  background-color: #0009;
  color: #fff;
}
</style>
