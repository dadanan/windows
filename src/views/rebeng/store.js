export default {
  fetch(key) {
    return window.localStorage.getItem(key)
  },
  save(key, value) {
    window.localStorage.setItem(key, value)
  },
  remove(key) {
    window.localStorage.removeItem(key)
  }
}
