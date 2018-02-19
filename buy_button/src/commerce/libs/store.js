/* eslint-disable */
export default {
  prefix: '_storyblok_',

  init(token) {
    this.prefix = '_storyblok_' + token + '_'
  },

  set(key, data) {
    if (data === null) {
      window.localStorage.removeItem(this.prefix + key)
    } else {
      window.localStorage.setItem(this.prefix + key, data)
    }
  },

  get(key) {
    let item = window.localStorage.getItem(this.prefix + key)

    if (item === 'undefined' || typeof item === 'undefined' || item === null) {
      return false
    }
    return item
  },

  delete(key) {
    window.localStorage.removeItem(this.prefix + key)
  }
}
