module.exports = {
  publicPath: (process.env.ENV === 'production' || process.env.ENV === 'test') ? './' : '/',
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
