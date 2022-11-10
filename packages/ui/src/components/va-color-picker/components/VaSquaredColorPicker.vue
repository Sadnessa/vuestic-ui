<template>
  <div class="va-squared-color-picker">
    <div class="va-squared-color-picker__canvas" @mousedown="mouseDown" @mouseup="mouseUp">
      <VaColorPickerMarker class="va-squared-color-picker__marker" :color="rgb" :style="{ top: `${position.y}px`, left: `${position.x}px` }" />
      <canvas width="300" height="300" ref="canvas" @mousemove="mouseMove" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { useCanvasCtx, useCanvasGradient, useMarkerPosition } from '../hooks/'
import { useSyncProp } from '../../../composables/'
import VaColorPickerMarker from './base/VaColorPickerMarker.vue'

export default defineComponent({
  name: 'VaSquaredColorPicker',
  components: {
    VaColorPickerMarker,
  },

  props: {
    modelValue: {
      type: Array as PropType<number[]>,
      required: true,
    },

    hueColor: {
      type: String,
      required: true,
      default: '#ff0000',
    },

    alphaValue: {
      type: Number,
      required: true,
      default: 1,
    },
  },

  emits: ['update:modelValue', 'update:hueColor', 'update:alphaValue'],

  setup (props, { emit }) {
    const canvas = ref<HTMLCanvasElement>()
    const { canvasCtx } = useCanvasCtx(canvas)
    const { createGradient, fillCanvas } = useCanvasGradient(canvasCtx)
    const [selectedColor] = useSyncProp('modelValue', props, emit)
    const [hueColor] = useSyncProp('hueColor', props, emit)
    const [alphaValue] = useSyncProp('alphaValue', props, emit)

    const rgb = computed(() => `rgb(${selectedColor.value.join(', ')})`)

    const renderCanvas = () => {
      if (canvasCtx == null) {
        return
      }

      fillCanvas(createGradient('horizontal', ['#fff', hueColor.value]))
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

    watch([hueColor, alphaValue], () => {
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
    }
  },
})
</script>

<style lang="scss" scoped>
.va-squared-color-picker {
  &__canvas {
    position: relative;
  }

  &__marker {
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
