<template>
  <div class="va-color-picker">
    <VaRoundedColorPicker v-model="valueComputed" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStateful, useStatefulProps, useStatefulEmits } from '../../composables'
import VaRoundedColorPicker from './components/VaRoundedColorPicker.vue'

export default defineComponent({
  name: 'VaColorPicker',
  components: {
    VaRoundedColorPicker,
  },

  props: {
    ...useStatefulProps,
  },

  emits: [
    ...useStatefulEmits,
  ],

  setup (props, { emit }) {
    const { valueComputed } = useStateful(props, emit)

    return {
      valueComputed,
    }
  },
})
</script>>

<style lang="scss">
@import '../../styles/resources';

.va-color-picker {

}
</style>
