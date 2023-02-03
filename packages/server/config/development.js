// const { deferConfig } = require('config/defer')

module.exports = {
  //   'pubsweet-server': {
  //     baseUrl: deferConfig(
  //       (cfg) =>
  //         `${cfg['pubsweet-server'].protocol}://${cfg['pubsweet-server'].host}${
  //           cfg['pubsweet-server'].port ? `:${cfg['pubsweet-server'].port}` : ''
  //         }`,
  //     ),
  //   },
  // }
  export: {
    scripts: [
      { label: 'Script1', filename: 'script1.js', scope: 'pagedjs' },
      { label: 'Script2', filename: 'script2.js', scope: 'epub' },
    ],
  },
}
