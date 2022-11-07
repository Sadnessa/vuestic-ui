<template>
  <VbDemo>
    <VbCard title="Title">
      <VaColorPicker v-model="selectedColor" />
    </VbCard>
  </VbDemo>
</template>

<script lang="ts">
import { ref } from 'vue'
import VaColorPicker from './VaColorPicker.vue'

export default {
  components: {
    VaColorPicker,
  },

  setup () {
    const selectedColor = ref<number[]>([255, 255, 255])

    return {
      selectedColor,
    }
  },
}
</script>
