const validata = {
  // 为空判断
  empty: message => {
    return (rule, value, callback) => {
      if (!value) {
        callback(new Error(message))
      } else {
        callback()
      }
    }
  },
  // 手机号
  phone: (rule, value, callback) => {
    var myreg = /^[1][34578][0-9]{9}$/
    if (value && !myreg.test(value)) {
      callback(new Error('手机号码格式不正确'))
    } else {
      callback()
    }
  },
  // 长度min - max
  lengthCheck: (min, max) => {
    return (rule, value, callback) => {
      if (value && (value.length < min || value.length > max)) {
        callback(new Error('长度必须在' + min + ' - ' + max + '位之间'))
      } else {
        callback()
      }
    }
  }
}

export default validata
