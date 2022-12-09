const AbstractModal = require('./src/AbstractModal')
const Modal = require('./src/Modal')
const TextInput = require('./src/TextInput')
const mimetypeHelpers = require('./src/utils/mimetypes')
const objectKeyExtractor = require('./src/utils/fileStorageObjectKeyExtractor')

module.exports = {
  AbstractModal: () => AbstractModal,
  Modal: () => Modal,
  TextInput: () => TextInput,
  mimetypeHelpers,
  objectKeyExtractor,
}
