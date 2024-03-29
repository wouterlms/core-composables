export default (): {
  formatBytes: (bytes: number, decimals?: number) => string
  toImage: (file: File) => Promise<HTMLImageElement>
  base64ToFile: (base64: string, originalFile?: File) => Promise<File>
} => {
  const formatBytes = (bytes: number, decimals = 2): string => {
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

  const toImage = async (file: File): Promise<HTMLImageElement> =>
    await new Promise<HTMLImageElement>((resolve) => {
      const image = new Image()

      image.addEventListener('load', () => {
        resolve(image)
      })

      image.src = URL.createObjectURL((file))
    })

  const base64ToFile = async (base64: string, originalFile?: File): Promise<File> => {
    const result = await fetch(base64)
    const blob = await result.blob()

    const file = new File([blob], originalFile?.name ?? 'image', {
      type: originalFile?.type ?? 'image/png',
      lastModified: originalFile?.lastModified
    })

    return file
  }

  return {
    formatBytes,
    toImage,
    base64ToFile
  }
}
