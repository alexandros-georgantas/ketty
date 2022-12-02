const babelIncludes = require('./babel-includes')

module.exports = [
  { test: /\.tsx?$/, loader: 'ts-loader' },
  {
    test: /\.js$|\.jsx$/,
    loader: 'babel-loader',
    query: {
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react',
      ],
      plugins: [
        require.resolve('react-hot-loader/babel'),
        '@babel/plugin-proposal-class-properties',
        // 'transform-decorators-legacy',
      ],
      env: {
        production: {
          /* bug requires mangle:false https://github.com/babel/minify/issues/556#issuecomment-339751209 */
          presets: [['minify', { builtIns: false, mangle: false }]],
        },
      },
    },
    include: babelIncludes,
  },
  {
    test: /\.png|\.jpg$/,
    loader: {
      loader: 'url-loader',
      options: {
        limit: 5000,
      },
    },
  },
  {
    test: /\.woff|\.woff2|\.svg|.eot|\.ttf|\.otf/,
    loader: [
      {
        loader: 'url-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  { test: /\.html$/, loader: 'html-loader' },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  },
]
