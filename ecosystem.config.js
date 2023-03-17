module.exports = {
  apps: [
    {
      name: "qsearch",
      script: "./index.js",
      out_file: "./logs/out.log",
      error_file: "./logs/err.log",
      time: true,
    },
  ],
}