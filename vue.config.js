module.exports = {
  chainWebpack: config => {
    config.module
      .rule("report-template")
      .test(/templates.html$/)
      .use("html-loader")
      .loader("html-loader");
  }
};
