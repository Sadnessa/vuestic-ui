<template>
  <div class="va-color-picker-marker" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VaColorPickerMarker',
  props: {
    color: String,
  },
})
</script>

<style lang="scss" scoped>
.va-color-picker-marker {
  z-index: 1;
  width: 20px;
  height: 20px;
  border: 2px solid;
  border-radius: 50%;
  background-color: v-bind(color);
}
</style>
