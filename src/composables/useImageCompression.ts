export default () => {
  const fileToCanvasImageSource = (file: File): Promise<HTMLImageElement> => (
    new Promise((resolve) => {
      const img = new Image()

      img.onload = () => {
        resolve(img)
      }

      img.src = URL.createObjectURL(file)
    })
  )

  const base64ToFile = (
    base64: string, mimeType: string
  ): Promise<File> => new Promise((resolve) => {
    fetch(base64)
      .then((res) => res.blob())
      .then((blob) => resolve(new File(
        [ blob ], 'image', {
          type: mimeType,
        }
      )))
  })

  const compress = async (image: File, quality = 0.8) => {
    if (quality < 0 || quality > 1) {
      throw Error('Quality must be a number between 0 and 1')
    }

    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const imageElement: HTMLImageElement = await fileToCanvasImageSource(image)

    canvas.width = imageElement.width
    canvas.height = imageElement.height

    ctx.drawImage(
      imageElement, 0, 0, imageElement.width, imageElement.height
    )

    const base64 = canvas.toDataURL(image.type, quality)

    return base64ToFile(base64, image.type)
  }

  return compress
}
