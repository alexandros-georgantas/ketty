module.exports = {
  featureBookStructure: 'FEATURE_BOOK_STRUCTURE',
  featureUploadDOCXFiles: 'FEATURE_UPLOAD_DOCX_FILES',
  tempDirectoryCleanUp: 'TEMP_DIRECTORY_CLEAN_UP',
  tempDirectoryCRONJobSchedule: 'TEMP_DIRECTORY_CRON_JOB_SCHEDULE',
  tempDirectoryCRONJobOffset: 'TEMP_DIRECTORY_CRON_JOB_OFFSET',
  serverIdentifier: 'SERVER_IDENTIFIER',
  flavour: 'EDITORIA_FLAVOUR',
  'pubsweet-client': {
    protocol: 'CLIENT_PROTOCOL',
    host: 'CLIENT_HOST',
    port: 'CLIENT_PORT',
  },
  'pubsweet-server': {
    admin: {
      username: 'ADMIN_USERNAME',
      password: 'ADMIN_PASSWORD',
      givenName: 'ADMIN_GIVEN_NAME',
      surname: 'ADMIN_SURNAME',
      email: 'ADMIN_EMAIL',
    },
    port: 'SERVER_PORT',
    protocol: 'SERVER_PROTOCOL',
    host: 'SERVER_HOST',
    secret: 'PUBSWEET_SECRET',
    serveClient: 'SERVER_SERVE_CLIENT',
    publicURL: 'PUBLIC_SERVER_URL',
    clientURL: 'PUBLIC_CLIENT_URL',
    WSServerPort: 'WS_SERVER_PORT',
    wsHeartbeatInterval: 'WS_HEARTBEAT_INTERVAL',
    failSafeUnlockingInterval: 'FAIL-SAFE_UNLOCKING_INTERVAL',
    db: {
      user: 'POSTGRES_USER',
      password: 'POSTGRES_PASSWORD',
      host: 'POSTGRES_HOST',
      database: 'POSTGRES_DB',
      port: 'POSTGRES_PORT',
    },
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
      externalUrl: 'PAGEDJS_PUBLIC_URL',
    },
    xsweet: {
      clientId: 'SERVICE_XSWEET_CLIENT_ID',
      clientSecret: 'SERVICE_XSWEET_SECRET',
      protocol: 'SERVICE_XSWEET_PROTOCOL',
      host: 'SERVICE_XSWEET_HOST',
      port: 'SERVICE_XSWEET_PORT',
    },
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
  'password-reset': {
    path: 'PASSWORD_RESET_PATH',
  },
  mailer: {
    from: 'MAILER_SENDER',
    transport: {
      host: 'MAILER_HOSTNAME',
      auth: {
        user: 'MAILER_USER',
        pass: 'MAILER_PASSWORD',
      },
    },
  },
}
