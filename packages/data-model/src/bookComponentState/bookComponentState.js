/*
  TO DO

  Define comments when wax 2 is up.
  Comment item userId should be related to the user table.
  Resolve user name when getting comments.

  Uploading (should it be here, or can we get away with simply
    writing it in localstorage?)
*/

const { Model } = require('objection')

const Base = require('../editoriaBase')
const { model: BookComponent } = require('../bookComponent')
const { booleanDefaultFalse, id, object } = require('../helpers').schema

class BookComponentState extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookComponentState'
  }

  static get tableName() {
    return 'BookComponentState'
  }

  static get relationMappings() {
    return {
      bookComponent: {
        relation: Model.BelongsToOneRelation,
        modelClass: BookComponent,
        join: {
          from: 'BookComponentState.bookComponentId',
          to: 'BookComponent.id',
        },
      },
    }
  }

  static get schema() {
    return {
      type: 'object',
      required: ['bookComponentId'],
      properties: {
        bookComponentId: id,
        comments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              timestamp: {
                type: 'string',
                format: 'date-time',
              },
              //  TODO FOREIGN userId:
              content: {
                type: 'String',
                minLength: 1,
              },
            },
          },
        },
        trackChangesEnabled: booleanDefaultFalse,
        // left loose on purpose to allow for configurability
        workflowStages: object,
      },
    }
  }

  getBookComponent() {
    return this.$relatedQuery('bookComponent')
  }
}

module.exports = BookComponentState
