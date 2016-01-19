var path = require('path')
var webpack = require('webpack')

var config = {

  debug: true,

  devtool: 'source-map',

  entry: {
    'index.ios': ['./src/main.ios.js'],
    'index.android': ['./src/main.android.js'],
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules/ddp-client'),
        path.resolve(__dirname, 'node_modules/react-native-addressbook'),
        path.resolve(__dirname, 'node_modules/react-native-checkbox'),
        path.resolve(__dirname, 'node_modules/react-native-communications'),
        path.resolve(__dirname, 'node_modules/react-native-device'),
        path.resolve(__dirname, 'node_modules/react-native-icons'),
        path.resolve(__dirname, 'node_modules/react-native-image-picker'),
        path.resolve(__dirname, 'node_modules/react-native-invertible-scroll-view'),
        path.resolve(__dirname, 'node_modules/react-native-keyboard-spacer'),
        path.resolve(__dirname, 'node_modules/react-native-multipicker'),
        path.resolve(__dirname, 'node_modules/react-native-navbar'),
        path.resolve(__dirname, 'node_modules/react-native-overlay'),
        path.resolve(__dirname, 'node_modules/react-native-remote-push'),
        path.resolve(__dirname, 'node_modules/react-native-side-menu'),
        path.resolve(__dirname, 'node_modules/react-native-swipeout'),
        // Note: add any other js or node modules that need babel processing
      ],
      loader: ['babel-loader'],
      query: {
        stage: 0,
        plugins: [],
        optional: 'runtime'
      }
    },{
      include: /\.json$/, loaders: ["json-loader"]
    }]
  },

  plugins: [],

  resolve: {
    extensions: ['', '.json', '.jsx', '.js']
  }

}

// Hot loader
if (process.env.HOT) {
  config.devtool = 'eval'; // Speed up incremental builds
  config.entry['index.ios'].unshift('react-native-webpack-server/hot/entry');
  config.entry['index.ios'].unshift('webpack/hot/only-dev-server');
  config.entry['index.ios'].unshift('webpack-dev-server/client?http://localhost:8082');
  config.output.publicPath = 'http://localhost:8082/';
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  config.module.loaders[0].query.plugins.push('react-transform');
  config.module.loaders[0].query.extra = {
    'react-transform': {
      transforms: [{
        transform: 'react-transform-hmr',
        imports: ['react-native'],
        locals: ['module']
      }]
    }
  };
}

// Production config
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
