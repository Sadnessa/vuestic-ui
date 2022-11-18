<template>
  <div class="va-squared-color-picker">
    <div class="va-squared-color-picker__group">
      <div class="va-squared-color-picker__canvas" @mousedown="mouseDown" @mouseup="mouseUp">
      <VaColorPickerMarker class="va-squared-color-picker__marker" :color="rgb" :style="{ top: `${position.y}px`, left: `${position.x}px` }" />
      <canvas width="300" height="300" ref="canvas" @mousemove="mouseMove" />
    </div>
    <div class="va-squared-color-picker__hue-slider">
      <VaColorSlider v-model="selectedColor" v-model:hueColor="hue" type='hue' />
    </div>
    </div>
    <div class="va-squared-color-picker__alpha-slider">
      <VaColorSlider v-model="selectedColor" v-model:hueColor="hue" v-model:alphaValue="alpha" type='alpha' />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { useCanvasCtx, useCanvasGradient, useMarkerPosition } from '../hooks/'
import { useSyncProp } from '../../../composables/'
import VaColorPickerMarker from './base/VaColorPickerMarker.vue'
import VaColorSlider from './base/VaColorSlider.vue'

export default defineComponent({
  name: 'VaSquaredColorPicker',
  components: {
    VaColorPickerMarker,
    VaColorSlider,
  },

  props: {
    modelValue: {
      type: Array as PropType<number[]>,
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
    const { canvasCtx } = useCanvasCtx(canvas)
    const { createGradient, fillCanvas } = useCanvasGradient(canvasCtx)
    const [selectedColor] = useSyncProp('modelValue', props, emit)
    const [hue] = useSyncProp('hueColor', props, emit)
    const [alpha] = useSyncProp('alphaValue', props, emit)

    const rgb = computed(() => `rgb(${selectedColor.value.join(', ')}, ${props.alphaValue})`)

    const renderCanvas = () => {
      if (canvasCtx == null) {
        return
      }

      fillCanvas(createGradient('horizontal', ['#fff', hue.value]))
      fillCanvas(createGradient('vertical', ['rgba(0,0,0,0)', '#000']))
    }

    const readColor = () => {
      const pixel = canvasCtx.value!.getImageData(position.x, position.y, 1, 1).data
      selectedColor.value = [pixel[0], pixel[1], pixel[2]]
    }

    const { mouseDown, mouseMove, mouseUp, position } = useMarkerPosition(readColor, canvas)

    onMounted(() => {
      renderCanvas()
    })

    watch([hue, alpha], () => {
      renderCanvas()
      readColor()
    })

    return {
      canvas,
      mouseDown,
      mouseMove,
      mouseUp,
      position,
      rgb,
      selectedColor,
      hue,
      alpha,
    }
  },
})
</script>

<style lang="scss" scoped>
.va-squared-color-picker {
  &__group {
    display: flex;

    :first-child {
      margin-right: 10px;
    }
  }

  &__canvas {
    position: relative;
  }

  &__marker {
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
