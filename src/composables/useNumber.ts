export default () => {
  const toLocaleString = (number: number, precision = 2) => (
    number.toLocaleString('nl-BE', { minimumFractionDigits: precision })
  )

  return {
    toLocaleString,
  }
}
