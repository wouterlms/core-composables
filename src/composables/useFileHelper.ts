export default () => {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = [
      'Bytes',
      'kB',
      'MB',
      'GB',
      'TB'
    ]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`
  }

  const toImage = (file: File) => new Promise<HTMLImageElement>((resolve) => {
    const image = new Image()

    image.addEventListener('load', () => {
      resolve(image)
    })

    image.src = URL.createObjectURL((file))
  })

  const base64ToFile = (base64: string): Promise<File> => new Promise((resolve) => {
    fetch(base64)
      .then((res) => res.blob())
      .then((blob) => resolve(new File(
        [ blob ], 'image', {
          type: 'image/png',
        }
      )))
  })

  return {
    formatBytes,
    toImage,
    base64ToFile,
  }
}
