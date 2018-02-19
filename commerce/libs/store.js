/* eslint-disable */
const PREFIX = '_storyblok_'

export default {
  set(key, data) {
    if (data === null) {
      window.localStorage.removeItem(PREFIX + key)
    } else {
      window.localStorage.setItem(PREFIX + key, data)
    }
  },

  get(key) {
    let item = window.localStorage.getItem(PREFIX + key)

    if (item === 'undefined' || typeof item === 'undefined' || item === null) {
      return false
    }
    return item
  },

  delete(key) {
    window.localStorage.removeItem(PREFIX + key)
  }
}
