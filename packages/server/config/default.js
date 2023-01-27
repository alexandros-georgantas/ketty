const path = require('path')

const components = require('./components')
// const winston = require('winston')
const authsomeVanilla = require('./modules/authsomeVanilla')
const authsomeBooksprints = require('./modules/authsomeBooksprints')
const bbVanilla = require('./modules/bookBuilderVanilla')
const bbOEN = require('./modules/bookBuilderOEN')
const bbBooksprints = require('./modules/bookBuilderBooksprints')
const waxVanilla = require('./modules/waxConfigVanilla')
const waxBooksprints = require('./modules/waxConfigBooksprints')
const permissions = require('./permissions')

// const logger = new winston.createLogger({
//   transports: [
//     new winston.transports.Console({
//       colorize: true,
//       handleExceptions: true,
//       humanReadableUnhandledException: true,
//     }),
//   ],
// })
const flavour =
  process.env.EDITORIA_FLAVOUR && process.env.EDITORIA_FLAVOUR === 'BOOKSPRINTS'
    ? 'BOOKSPRINTS'
    : 'VANILLA'
// const featureBookStructureEnabled = process.env.FEATURE_BOOK_STRUCTURE || false

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

let bookBuilder

if (!featureBookStructureEnabled) {
  if (flavour === 'BOOKSPRINTS') {
    bookBuilder = bbBooksprints
  } else {
    bookBuilder = bbVanilla
  }
} else {
  bookBuilder = bbOEN
}

module.exports = {
  authsome: flavour === 'BOOKSPRINTS' ? authsomeBooksprints : authsomeVanilla,
  bookBuilder,
  wax: flavour === 'BOOKSPRINTS' ? waxBooksprints : waxVanilla,
  epub: {
    fontsPath: '/uploads/fonts',
  },
  'password-reset': {
    path: 'password-reset',
  },
  mailer: {
    from: 'info@editoria.com',
    path: path.join(__dirname, 'mailer'),
  },
  permissions,
  publicKeys: [
    'authsome',
    'bookBuilder',
    'pubsweet',
    'pubsweet-client',
    'pubsweet-server',
    'validations',
    'wax',
  ],
  pubsweet: {
    components,
  },
  'pubsweet-client': {
    API_ENDPOINT: '/api',
    'login-redirect': '/',
    navigation: 'app/components/Navigation/Navigation.jsx',
    routes: 'app/routes.jsx',
    theme: 'ThemeEditoria',
    converter: 'ucp',
    port: 3000,
    protocol: 'http',
    host: 'localhost',
  },
  'pubsweet-server': {
    db: {},
    useGraphQLServer: true,
    useJobQueue: false,
    serveClient: false,
    graphiql: true,
    tokenExpiresIn: '360 days',
    externalServerURL: undefined,
    // logger,
    port: 3000,
    protocol: 'http',
    host: 'localhost',
    uploads: 'uploads',
    pool: { min: 0, max: 10, idleTimeoutMillis: 1000 },
    admin: {
      username: 'ADMIN_USERNAME',
      password: 'ADMIN_PASSWORD',
      givenName: 'ADMIN_GIVEN_NAME',
      surname: 'ADMIN_SURNAME',
      email: 'ADMIN_EMAIL',
    },
    cron: {
      path: path.join(__dirname, '..', 'services', 'cron.service.js'),
    },
    // useWebSockets: true,
    // websocketPaths: 'locks',
  },
  'file-server': {
    accessKeyId: 'S3_ACCESS_KEY_ID_USER',
    secretAccessKey: 'S3_SECRET_ACCESS_KEY_USER',
    bucket: 'S3_BUCKET',
    protocol: 'S3_PROTOCOL',
    host: 'S3_HOST',
    port: 'S3_PORT',
    minioConsolePort: 'MINIO_CONSOLE_PORT',
  },
  services: {
    'epub-checker': {
      clientId: 'SERVICE_EPUB_CHECKER_CLIENT_ID',
      clientSecret: 'SERVICE_EPUB_CHECKER_SECRET',
      protocol: 'SERVICE_EPUB_CHECKER_PROTOCOL',
      host: 'SERVICE_EPUB_CHECKER_HOST',
      port: 'SERVICE_EPUB_CHECKER_PORT',
    },
    icml: {
      clientId: 'SERVICE_ICML_CLIENT_ID',
      clientSecret: 'SERVICE_ICML_SECRET',
      protocol: 'SERVICE_ICML_PROTOCOL',
      host: 'SERVICE_ICML_HOST',
      port: 'SERVICE_ICML_PORT',
    },
    pagedjs: {
      clientId: 'SERVICE_PAGEDJS_CLIENT_ID',
      clientSecret: 'SERVICE_PAGEDJS_SECRET',
      protocol: 'SERVICE_PAGEDJS_PROTOCOL',
      host: 'SERVICE_PAGEDJS_HOST',
      port: 'SERVICE_PAGEDJS_PORT',
    },
    xsweet: {
      clientId: 'SERVICE_XSWEET_CLIENT_ID',
      clientSecret: 'SERVICE_XSWEET_SECRET',
      protocol: 'SERVICE_XSWEET_PROTOCOL',
      host: 'SERVICE_XSWEET_HOST',
      port: 'SERVICE_XSWEET_PORT',
    },
  },
  templates: ['Atla'],
  export: {
    rootFolder: 'config/exportScripts',
    scripts: [],
  },
  schema: {},
  validations: path.join(__dirname, 'modules', 'validations'),
  featureBookStructure: false,
  featureUploadDOCXFiles: true,
  tempDirectoryCleanUp: true,
}
