<template>
  <div class="va-rounded-color-picker" :style="{ background: rgb }">
    {{ l }}
    <VaHS v-model="hs" />
    <div class="va-rounded-color-picker__alpha-slider">
      <!-- <VaColorSlider v-model="selectedColor" v-model:alphaValue="alpha" type='alpha' /> -->
    </div>
    <div class="va-rounded-color-picker__lightness-slider">
      <VaColorSlider2 :gradient="lightnessGradient" v-model="hsl" :position="1" />
    </div>
  </div>
</template>

<script lang="ts">
import { ColorTranslator } from 'colortranslator'
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { useCanvasCtx, useCanvasGradient } from '../hooks/'
import { useSyncProp } from '../../../composables/'
import VaHS from './base/VaHS.vue'
import VaColorSlider from './base/VaColorSlider.vue'
import VaColorSlider2 from './base/VaColorSlider2.vue'

export default defineComponent({
  name: 'VaRoundedColorPicker',
  components: {
    VaHS,
    // VaColorSlider,
    VaColorSlider2,
  },

  props: {
    modelValue: {
      type: String,
      required: true,
    },

    hueColor: {
      type: String,
      required: true,
    },

    alphaValue: {
      type: Number,
      default: 1,
    },
  },

  emits: ['update:modelValue', 'update:hueColor', 'update:alphaValue'],

  setup (props, { emit }) {
    const canvas = ref<HTMLCanvasElement>()
    const [selectedColor] = useSyncProp('modelValue', props, emit)
    const [hue] = useSyncProp('hueColor', props, emit)
    const [alpha] = useSyncProp('alphaValue', props, emit)

    const hs = ref([255, 255, 255])
    const hsl = ref([255, 255, 255])

    const rgb = computed(() => colorToString(hsl.value))

    const colorToString = (color: number[]) => {
      return `rgb(${color.join(', ')})`
    }

    const lightnessGradient = computed(() => {
      return ['black', colorToString(hs.value)]
    })

    const l = computed(() => {
      return new ColorTranslator(rgb.value).L / new ColorTranslator(colorToString(hs.value)).L
    })

    watch(selectedColor, () => {
      const color = new ColorTranslator(selectedColor.value)
      console.log(color.H, color.S, color.L)
      hsl.value = [color.R, color.G, color.B]
      color.setL(100)
      hs.value = [color.R, color.G, color.B]
    }, { immediate: true })

    watch(rgb, () => {
      selectedColor.value = rgb.value
    })

    return {
      canvas,
      rgb,
      selectedColor,
      hue,
      alpha,
      hs,
      lightnessGradient,
      hsl,
      l,
    }
  },
})
</script>

<style lang="scss" scoped>
.va-rounded-color-picker {
  &__canvas {
    position: relative;
    border-radius: 50%;

    canvas {
      border-radius: 50%;
    }
  }

  &__marker {
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
