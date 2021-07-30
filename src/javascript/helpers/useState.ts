const state = new Map()

export const useState = (identifier: string, defaults: {}) => {
  if (localStorage[identifier]) Object.assign(defaults, JSON.parse(localStorage[identifier]))
 
  const newObject = Object.assign({
    save () {
      localStorage[identifier] = JSON.stringify(this)
    }
  }, defaults)
  return state.has(identifier) ? state.get(identifier) : state.set(identifier, newObject) && state.get(identifier)
}
