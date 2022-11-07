import { Ref } from 'vue'
type GradientDirection = 'vertical' | 'horizontal' | 'conic' | 'radial';

export const useCanvasGradient = (canvasCtx: Ref<null | CanvasRenderingContext2D>) => {
  const chooseDirection = (direction: GradientDirection) => {
    const ctx = canvasCtx.value!
    if (direction === 'vertical') {
      return ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
    }

    if (direction === 'horizontal') {
      return ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    }

    if (direction === 'conic') {
      return ctx.createConicGradient(0, ctx.canvas.width / 2, ctx.canvas.height / 2)
    }

    if (direction === 'radial') {
      return ctx.createRadialGradient(ctx.canvas.width / 2, ctx.canvas.height / 2, 0, ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width / 2)
    }

    throw new Error('Wrong direction parameter')
  }

  const fillCanvas = (color: CanvasGradient) => {
    canvasCtx.value!.fillStyle = color
    canvasCtx.value!.fillRect(0, 0, canvasCtx.value!.canvas.width, canvasCtx.value!.canvas.height)
  }

  const createGradient = (direction: GradientDirection, colors: string[]) => {
    const gradient = chooseDirection(direction)
    colors.forEach((item, index) => {
      gradient.addColorStop((1 / (colors.length - 1)) * index, item)
    })
    return gradient
  }

  return {
    fillCanvas,
    createGradient,
  }
}
