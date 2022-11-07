import { onMounted, ref, Ref } from 'vue'

export const useCanvasCtx = (canvas: Ref<HTMLCanvasElement | undefined>) => {
  const canvasCtx = ref<null | CanvasRenderingContext2D>(null)

  onMounted(() => {
    canvasCtx.value = canvas.value!.getContext('2d')!
  })

  return {
    canvasCtx,
  }
}
