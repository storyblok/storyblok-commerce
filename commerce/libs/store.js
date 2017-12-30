/* eslint-disable */
const PREFIX = '_storyblok_' + window.SITE_CURRENCY + '_'

export default {
  set(key, data) {
    window.localStorage.setItem(PREFIX + key, data)
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
