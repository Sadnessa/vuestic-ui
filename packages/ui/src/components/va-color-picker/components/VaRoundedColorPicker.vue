<template>
  <div class="va-rounded-color-picker">
    <div class="va-rounded-color-picker__canvas" @mousedown="mouseDown" @mouseup="mouseUp">
      <VaColorPickerMarker class="va-rounded-color-picker__marker" :color="rgb" :style="{ top: `${position.y}px`, left: `${position.x}px` }" />
      <canvas width="300" height="300" ref="canvas" @mousemove="mouseMove" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { useCanvasCtx, useCanvasGradient, useMarkerPosition } from '../hooks/'
import { useSyncProp } from '../../../composables/'
import VaColorPickerMarker from './base/VaColorPickerMarker.vue'

export default defineComponent({
  name: 'VaRoundedColorPicker',
  components: {
    VaColorPickerMarker,
  },

  props: {
    modelValue: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const canvas = ref<HTMLCanvasElement>()
    const { canvasCtx } = useCanvasCtx(canvas)
    const { createGradient, fillCanvas } = useCanvasGradient(canvasCtx)
    const [selectedColor] = useSyncProp('modelValue', props, emit)

    const rgb = computed(() => `rgb(${selectedColor.value.join(', ')})`)

    const renderCanvas = () => {
      if (canvasCtx == null) {
        return
      }

      fillCanvas(createGradient('conic', ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']))
      fillCanvas(createGradient('radial', ['white', 'rgba(0,0,0,0)']))
    }

    const readColor = () => {
      const pixel = canvasCtx.value!.getImageData(position.x, position.y, 1, 1).data
      selectedColor.value = [pixel[0], pixel[1], pixel[2]]
    }

    const { mouseDown, mouseMove, mouseUp, position } = useMarkerPosition(readColor, canvas)

    onMounted(() => {
      position.x = canvas.value!.width / 2
      position.y = canvas.value!.height / 2
      renderCanvas()
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
