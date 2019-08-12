const validata = {
  // 为空判断
  empty: (rule, value, callback) => {
    if (!value) {
      callback(new Error('不能为空'))
    } else {
      callback()
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
  // 密码长度6 - 18
  password6_18: (rule, value, callback) => {
    if (value && (value.length < 6 || value.length > 18)) {
      callback(new Error('密码长度必须在6 - 18位之间'))
    } else {
      callback()
    }
  }
}

export default validata
