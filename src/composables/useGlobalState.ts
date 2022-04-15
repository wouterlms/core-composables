const globalState = new Map()

export default <T>(id: string, state: T): T => {
  if (globalState.get(id) === undefined) {
    globalState.set(id, state)
  }

  return globalState.get(id)
}
