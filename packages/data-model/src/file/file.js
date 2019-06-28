const { Model } = require('objection')

const Base = require('../editoriaBase')

const {
  arrayOfStringsNotEmpty,
  foreignType,
  id,
  integerPositive,
  mimetype,
  stringNotEmpty,
  uri,
} = require('../helpers').schema

class File extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'file'
  }

  static get tableName() {
    return 'File'
  }

  static get relationMappings() {
    const { model: Book } = require('../book')
    const { model: BookComponent } = require('../bookComponent')
    const { model: FileTranslation } = require('../fileTranslation')
    const { model: Template } = require('../template')

    return {
      book: {
        relation: Model.BelongsToOneRelation,
        modelClass: Book,
        join: {
          from: 'File.bookId',
          to: 'Book.id',
        },
      },
      bookComponent: {
        relation: Model.BelongsToOneRelation,
        modelClass: BookComponent,
        join: {
          from: 'File.bookComponentId',
          to: 'BookComponent.id',
        },
      },
      template: {
        relation: Model.BelongsToOneRelation,
        modelClass: Template,
        join: {
          from: 'File.templateId',
          to: 'Template.id',
        },
      },
      fileTranslations: {
        relation: Model.HasManyRelation,
        modelClass: FileTranslation,
        join: {
          from: 'File.id',
          to: 'FileTranslation.fileId',
        },
      },
    }
  }

  static get schema() {
    return {
      type: 'object',
      required: ['filename', 'source'],
      properties: {
        filename: stringNotEmpty,
        bookId: id,
        bookComponentId: id,
        templateId: id,
        foreignType,
        mimetype,
        referenceId: id,
        size: integerPositive,
        source: uri,
        tags: arrayOfStringsNotEmpty,
      },
    }
  }

  getBook() {
    return this.$relatedQuery('book')
  }

  getBookComponent() {
    return this.$relatedQuery('bookComponent')
  }

  getFileTranslations() {
    return this.$relatedQuery('fileTranslations')
  }

  getTemplate() {
    return this.$relatedQuery('template')
  }
}

module.exports = File
