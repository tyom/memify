<template>
  <div class="Toolbar">
    <ToolbarActions
      v-if="meme.id"
      :title="meme.title"
      :meme-id="meme.id"
      :has-changed="hasChanged"
      @save="$emit('save')"
      @restore="$emit('restore')"
      @render="$emit('render')"
    />
    <v-divider />
    <ToolbarCaptionControls
      :caption="meme.caption"
      @update:caption="$emit('update:caption', $event)"
    />
  </div>
</template>

<script>
import ToolbarActions from './ToolbarActions';
import ToolbarCaptionControls from './ToolbarCaptionControls';

export default {
  components: {
    ToolbarActions,
    ToolbarCaptionControls,
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
