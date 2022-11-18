<template>
  <div class="va-color-slider" @mousedown="mouseDown" @mouseup="mouseUp">
    <VaColorPickerMarker class="va-color-slider__marker" :color="colorComputed" :style="markerStyle" />
    <canvas class="va-color-slider__canvas" ref='canvas' :width="canvasWidth" :height="canvasHeight"
      @mousemove="mouseMove" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { useCanvasCtx, useCanvasGradient, useMarkerPosition } from '../../hooks'
import { useSyncProp } from '../../../../composables'
import { computed } from '@vue/reactivity'
import VaColorPickerMarker from './VaColorPickerMarker.vue'

export default defineComponent({
  name: 'VaColorSlider',

  components: {
    VaColorPickerMarker,
  },

  props: {
    type: {
      type: String as PropType<'hue' | 'alpha' | 'lightness'>,
      validator: (prop: string) => ['hue', 'alpha', 'lightness'].includes(prop),
    },

    modelValue: {
      type: Array as PropType<number[]>,
      required: true,
    },

    alphaValue: {
      type: Number,
      default: 1,
    },

    hueColor: {
      type: Array as PropType<number[]>,
      // default: '#ff0000',
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

    const canvasWidth = computed(() => props.type === 'hue' ? '40' : '300')
    const canvasHeight = computed(() => props.type === 'hue' ? '300' : '40')
    const color = computed<string>(() => {
      return `rgb(${selectedColor.value.join(', ')})`
    })
    const colorComputed = computed(() => {
      if (props.type === 'hue') {
        return colorToString(props.hueColor!)
      } else if (props.type === 'alpha') {
        return `rgba(${selectedColor.value.join(', ')}, ${alphaValue.value})`
      } else {
        return color.value
      }
    })
    const markerStyle = computed(() => props.type === 'hue' ? `top: ${position.y}px; background-color: ${hueColor}` : `left: ${position.x}px; top: 50%; background-color: rgba(${selectedColor.value.join(', ')},)`)

    const colorToString = (color: number[]) => {
      return `rgb(${color.join(', ')})`
    }

    const renderCanvas = () => {
      if (canvasCtx == null) {
        return
      }

      canvasCtx.value!.clearRect(0, 0, canvasCtx.value!.canvas.width, canvasCtx.value!.canvas.height)

      if (props.type === 'hue') {
        fillCanvas(createGradient('vertical', ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']))
      }
      if (props.type === 'alpha') {
        fillCanvas(createGradient('horizontal', ['rgba(0,0,0,0)', color.value]))
      }
      if (props.type === 'lightness') {
        fillCanvas(createGradient('horizontal', ['black', colorToString(hueColor.value!)]))
      }
    }

    const readColor = () => {
      if (props.type === 'hue') {
        const pixel = canvasCtx.value!.getImageData(0, position.y, 1, 1).data
        hueColor.value = [pixel[0], pixel[1], pixel[2]]
      }
      if (props.type === 'alpha') {
        const pixel = canvasCtx.value!.getImageData(position.x, 1, 1, 1).data
        alphaValue.value = pixel[3] / 255
      }
      if (props.type === 'lightness') {
        const pixel = canvasCtx.value!.getImageData(position.x, 1, 1, 1).data
        selectedColor.value = [pixel[0], pixel[1], pixel[2]]
      }
    }

    const { mouseDown, mouseMove, mouseUp, position } = useMarkerPosition(readColor, canvas)

    onMounted(() => {
      if (props.type === 'alpha') {
        position.x = canvas.value!.width * props.alphaValue
      }
      renderCanvas()
    })

    watch(hueColor, () => {
      renderCanvas()
    })

    if (props.type === 'alpha') {
      watch(alphaValue, () => {
        renderCanvas()
        readColor()
      })
    }

    return {
      canvas,
      canvasWidth,
      canvasHeight,
      mouseDown,
      mouseMove,
      mouseUp,
      position,
      colorComputed,
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
