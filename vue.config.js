module.exports = {
  publicPath: process.env.ENV === 'production' ? './' : '/',
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
