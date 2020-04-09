const path = require("path");
const ExtractCSS = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
//server 코드와 연관시키지 않을것, only for client code
const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");
const config = {
  entry: ["@babel/polyfill", ENTRY_FILE],
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          }
        ]
      },
      {
        //loader는 기본적으로  webpack에서 파일을 처리하는 방법을 알려줌
        test: /\.scss$/,
        use: ExtractCSS.extract([
          //추출
          {
            loader: "css-loader" //c    ss를 가져옴
          },
          {
            loader: "postcss-loader", //특정 plugin들을 css에 대해서 실행시켜줌
            options: {
              plugin() {
                return [autoprefixer({ browsers: "cover 99.5%" })];
              }
            }
          },
          {
            loader: "sass-loader" //scss를 css로 번역해줌
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  },
  plugins: [new ExtractCSS("styles.css")]
  //node: { fs: "empty" }
};
module.exports = config;
