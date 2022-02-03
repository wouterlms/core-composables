export default () => {
  const deepClone = (object: Record<string, unknown>) => (
    JSON.parse((JSON.stringify(object)))
  )

  return {
    deepClone,
  }
}
