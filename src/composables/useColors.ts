interface RGB {
  r: number
  g: number
  b: number
}

export default () => {
  const isRgb = (color: string) => color.startsWith('rgb')

  const rgbStringToObject = (rgb: string): RGB => {
    const rgbArray = rgb.replace(/[^\d,]/g, '').split(',')

    return {
      r: +rgbArray[0],
      g: +rgbArray[1],
      b: +rgbArray[2],
    }
  }

  const hexToRgbObject = (hex: string): RGB => {
    let r = 0
    let g = 0
    let b = 0

    // 3 digits
    if (hex.length === 4) {
      r = +`0x${hex[1]}${hex[1]}`
      g = +`0x${hex[2]}${hex[2]}`
      b = +`0x${hex[3]}${hex[3]}`

      // 6 digits
    } else if (hex.length === 7) {
      r = +`0x${hex[1]}${hex[2]}`
      g = +`0x${hex[3]}${hex[4]}`
      b = +`0x${hex[5]}${hex[6]}`
    }

    return {
      r,
      g,
      b,
    }
  }

  const isDarkColor = (color: string) => {
    let rgb

    if (isRgb(color)) {
      rgb = rgbStringToObject(color)
    } else {
      rgb = hexToRgbObject(color)
    }

    const hsp = Math.sqrt(
      0.299 * (rgb.r * rgb.r) + 0.587 * (rgb.g * rgb.g) + 0.114 * (rgb.b * rgb.b)
    )

    return hsp <= 127.5
  }

  return { isDarkColor }
}
