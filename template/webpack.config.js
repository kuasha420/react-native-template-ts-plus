const path = require('path');
const webpack = require('webpack');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.(j|t)sx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'index.js'),
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // Re-write paths to import only the modules needed by the app
      plugins: ['react-native-web'],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg|ttf)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

module.exports = {
  mode: 'development',

  devtool: 'source-map',

  // Development server config
  devServer: {
    publicPath: '/build',
    contentBase: path.join(__dirname, 'web'),
    historyApiFallback: true,
  },

  plugins: [
    // fix "process is not defined" error:
    // (do "npm install process" before running the build)
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],

  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(__dirname, 'index.web.js'),
  ],

  // configures where the build ends up
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'web/build'),
  },

  // ...the rest of your config

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },

  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      process: 'process/browser',
      'react-native/Libraries/ReactNative/AppContainer':
        'react-native-web/dist/exports/AppRegistry/AppContainer',
      'react-native/Libraries/Components/View/ReactNativeStyleAttributes.js':
        'react-native-web/dist/exports/AppRegistry/AppContainer',
      'react-native$': 'react-native-web',
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
};
