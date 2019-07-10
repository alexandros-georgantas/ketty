const { Model } = require('objection')

const Base = require('../editoriaBase')
const {
  arrayOfIds,
  id,
  stringNotEmpty,
  string,
  targetType,
} = require('../helpers').schema

class Template extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'template'
  }

  static get tableName() {
    return 'Template'
  }

  static get schema() {
    return {
      type: 'object',
      required: ['templateName'],
      properties: {
        templateName: stringNotEmpty,
        referenceId: id,
        author: string,
        thumbnailId: id,
        files: arrayOfIds,
        target: targetType,
      },
    }
  }

  static get relationMappings() {
    const { model: File } = require('../file')

    return {
      files: {
        relation: Model.HasManyRelation,
        modelClass: File,
        join: {
          from: 'File.templateId',
          to: 'Template.id',
        },
      },
      thumbnail: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          from: 'Template.thumbnailId',
          to: 'File.id',
        },
      },
    }
  }

  getFiles() {
    return this.$relatedQuery('files')
  }
  getThumbnail() {
    return this.$relatedQuery('thumbnail')
  }
}

module.exports = Template
