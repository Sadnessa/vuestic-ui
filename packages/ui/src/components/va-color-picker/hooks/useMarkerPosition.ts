import { reactive, ref, Ref } from 'vue'

export const useMarkerPosition = (readColor: () => any, canvas: Ref<HTMLCanvasElement | undefined>, initialPosition: { x: number, y: number } = { x: 0, y: 0 }) => {
  const isPressed = ref(false)
  const position = reactive(initialPosition)

  const onCanvasClick = (event: MouseEvent) => {
    const { x: canvasX, y: canvasY } = canvas.value!.getBoundingClientRect()
    position.x = event.clientX - canvasX
    position.y = event.clientY - canvasY
    readColor()
  }

  const mouseDown = () => {
    isPressed.value = true
  }

  const mouseMove = (event: MouseEvent) => {
    if (isPressed.value) {
      onCanvasClick(event)
    }
  }

  const mouseUp = () => {
    isPressed.value = false
  }

  return {
    mouseDown,
    mouseMove,
    mouseUp,
    position,
  }
}
