import useFileHelper from './useFileHelper'

interface CropOptions {
  aspectRatio?: number
  width?: number
  height?: number
}

export default (): {
  compress: (file: File, quality: number) => Promise<File>
  crop: (file: File, options: CropOptions) => Promise<File>
  resize: (file: File, width: number) => Promise<File>
} => {
  const { toImage, base64ToFile } = useFileHelper()

  const crop = async (image: File, { aspectRatio, width, height }: CropOptions): Promise<File> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const imageElement = await toImage(image)

    if (width !== undefined && height !== undefined) {
      canvas.width = width
      canvas.height = height
    } else if (width !== undefined && aspectRatio !== undefined) {
      canvas.width = width
      canvas.height = width / aspectRatio
    } else if (height !== undefined && aspectRatio !== undefined) {
      canvas.height = height
      canvas.width = height * aspectRatio
    } else {
      throw new Error('Invalid options')
    }

    const scale = Math.max(canvas.width / imageElement.width, canvas.height / imageElement.height)
    const x = canvas.width / 2 - (imageElement.width / 2) * scale
    const y = canvas.height / 2 - (imageElement.height / 2) * scale

    ctx.drawImage(
      imageElement, x, y, imageElement.width * scale, imageElement.height * scale
    )

    return await base64ToFile(canvas.toDataURL(image.type), image)
  }

  const resize = async (image: File, width: number): Promise<File> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const imageElement = await toImage(image)

    if (imageElement.naturalWidth < width) {
      return image
    }

    const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight

    canvas.width = width
    canvas.height = width / aspectRatio

    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)

    return await base64ToFile(canvas.toDataURL(image.type), image)
  }

  const compress = async (image: File, quality = 0.8): Promise<File> => {
    if (quality < 0 || quality > 1) {
      throw Error('Quality must be a number between 0 and 1')
    }

    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const imageElement: HTMLImageElement = await toImage(image)

    canvas.width = imageElement.width
    canvas.height = imageElement.height

    ctx.drawImage(
      imageElement,
      0,
      0,
      imageElement.width,
      imageElement.height
    )

    const base64 = canvas.toDataURL(image.type, quality)

    return await base64ToFile(base64, image)
  }

  return {
    compress,
    crop,
    resize
  }
}
