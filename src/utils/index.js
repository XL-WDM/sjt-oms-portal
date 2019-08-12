const util = {
  isExist: (list, method = () => {}) => {
    for (var idx in list) {
      if (method(list[idx], idx)) {
        return true
      }
    }
    return false
  },
  map: (list, method = () => {}) => {
    const map = []
    for (var idx in list) {
      map.push(method(list[idx], idx))
    }
    return map
  },
  filter: (list, method = () => {}) => {
    const map = []
    for (var idx in list) {
      if (method(list[idx], idx)) {
        map.push(list[idx])
      }
    }
    return map
  }
}

export default util
