<template>
  <div class="va-color-picker">
    <VaRoundedColorPicker v-model="valueComputed" v-model:hueColor="hueColor" v-model:alphaValue="alphaColor" />
    <!-- <VaSquaredColorPicker v-model="valueComputed" v-model:hueColor="hueColor" v-model:alphaValue="alphaColor" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStateful, useStatefulProps, useStatefulEmits } from '../../composables'
import VaRoundedColorPicker from './components/VaRoundedColorPicker.vue'
import VaSquaredColorPicker from './components/VaSquaredColorPicker.vue'

export default defineComponent({
  name: 'VaColorPicker',
  components: {
    VaRoundedColorPicker,
    // VaSquaredColorPicker,
  },

  props: {
    ...useStatefulProps,
  },

  emits: [
    ...useStatefulEmits,
  ],

  setup (props, { emit }) {
    const { valueComputed } = useStateful(props, emit)
    const hueColor = ref<string>('#ff0000')
    const alphaColor = ref<number>(1)

    return {
      valueComputed,
      hueColor,
      alphaColor,
    }
  },
})
</script>>

<style lang="scss">
@import '../../styles/resources';

.va-color-picker {

}
</style>
