<template>
  <div class="va-color-slider" @mousedown="mouseDown" @mouseup="mouseUp">
    <VaColorPickerMarker class="va-color-slider__marker" color="white" :style="markerStyle" />
    <canvas class="va-color-slider__canvas" ref='canvas' :width="canvasWidth" :height="canvasHeight"
      @mousemove="mouseMove" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { useCanvasCtx, useCanvasGradient, useMarkerPosition } from '../../hooks'
import { useSyncProp } from '../../../../composables'
import VaColorPickerMarker from './VaColorPickerMarker.vue'

export default defineComponent({
  name: 'VaColorSlider2',

  components: {
    VaColorPickerMarker,
  },

  props: {
    gradient: {
      type: Array as PropType<string[]>,
      required: true,
    },

    modelValue: {
      type: Array as PropType<number[]>,
    },

    vertical: {
      type: Boolean,
      default: false,
    },

    /** From 0 to 1 */
    position: {
      type: Number,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const canvas = ref<HTMLCanvasElement>()
    const { canvasCtx } = useCanvasCtx(canvas)
    const { fillCanvas, createGradient } = useCanvasGradient(canvasCtx)
    const [modelValueSync] = useSyncProp('modelValue', props, emit)

    const canvasWidth = computed(() => props.vertical ? '40' : '300')
    const canvasHeight = computed(() => props.vertical ? '300' : '40')

    const readColor = () => {
      const pixel = props.vertical ? canvasCtx.value!.getImageData(0, position.y, 1, 1).data : canvasCtx.value!.getImageData(position.x, 1, 1, 1).data
      modelValueSync.value = [pixel[0], pixel[1], pixel[2]]
    }

    // TODO: useCanvasSizes
    const { mouseDown, mouseMove, mouseUp, position } = useMarkerPosition(readColor, canvas, { x: props.position * 299, y: props.position * 299 })

    const renderCanvas = () => {
      if (canvasCtx == null) {
        return
      }

      canvasCtx.value!.clearRect(0, 0, canvasCtx.value!.canvas.width, canvasCtx.value!.canvas.height)

      fillCanvas(createGradient(props.vertical ? 'vertical' : 'horizontal', props.gradient))
    }

    const markerStyle = computed(() => {
      return props.vertical ? { top: position.y + 'px' } : { left: position.x + 'px' }
    })

    onMounted(renderCanvas)

    watch(() => props.gradient, () => {
      renderCanvas()
      readColor()
    })

    return {
      mouseDown,
      canvas,
      mouseMove,
      mouseUp,
      canvasWidth,
      canvasHeight,
      markerStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.va-color-slider {
  position: relative;
  font-size: 0;

  &__marker {
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
    left: 50%;
  }

  &__canvas {
    background-color: #ffffff;
    opacity: 0.8;
    background-image: repeating-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 75%, #cccccc 75%, #cccccc), repeating-linear-gradient(45deg, #cccccc 25%, #e5e5f7 25%, #ffffff 75%, #cccccc 75%, #cccccc);
    background-position: 0 0, 10px 10px;
    background-size: 20px 20px;
  }
}
</style>
