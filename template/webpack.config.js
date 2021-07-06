const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webConfig = require('./react-native-web.config');

// Inspiration from https://github.com/facebook/create-react-app/blob/64df135c29208f08a175c941a0e94d9a56d9e4af/packages/react-dev-utils/getPublicUrlOrPath.js#L47
let { homepage } = require(path.resolve(__dirname, 'package.json'));
let publicPath = '/';
if (homepage) {
  const stubDomain = 'https://create-react-app.dev';

  homepage = homepage.endsWith('/') ? homepage : homepage + '/';

  const validHomepagePathname = new URL(homepage, stubDomain).pathname;
  publicPath = homepage.startsWith('.') ? homepage : validHomepagePathname;
}

const modulesToTranspile = webConfig.needsTranspile.map((mod) =>
  path.resolve(__dirname, 'node_modules', mod)
);

const babelLoaderConfiguration = {
  test: /\.(j|t)sx?$/,
  include: [
    path.resolve(__dirname, 'index.web.js'),
    path.resolve(__dirname, 'src'),
    ...modulesToTranspile,
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      plugins: ['react-native-web'],
    },
  },
};

const assetsLoaderConfig = {
  test: /\.(gif|jpe?g|png|svg|ttf)$/,
  type: 'asset',
  generator: {
    filename: 'assets/[name][ext]',
  },
};

const config = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'web'),
    historyApiFallback: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'web',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'web', 'index.html'),
    }),
  ],

  entry: [
    // your web-specific entry file
    path.resolve(__dirname, 'index.web.js'),
  ],

  output: {
    filename: 'bundle.js',
    publicPath,
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },

  module: {
    rules: [babelLoaderConfiguration, assetsLoaderConfig],
  },

  resolve: {
    alias: {
      process: 'process/browser',
      'react-native/Libraries/ReactNative/AppContainer':
        'react-native-web/dist/exports/AppRegistry/AppContainer',
      'react-native/Libraries/Components/View/ReactNativeStyleAttributes.js':
        'react-native-web/dist/exports/AppRegistry/AppContainer',
      'react-native$': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
};

module.exports = (env, argv) => {
  const mode = argv.mode ?? config.mode;
  config.mode = mode;

  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: mode === 'development',
    })
  );

  return config;
};
