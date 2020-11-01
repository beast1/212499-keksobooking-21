const path = require("path");

module.exports = {
  entry: [
    "./js/util.js",
    "./js/debounce.js",
    "./js/load.js",
    "./js/upload.js",
    "./js/data.js",
    "./js/card.js",
    "./js/pin.js",
    "./js/filter.js",
    "./js/form.js",
    "./js/controlPin.js",
    "./js/main.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};

