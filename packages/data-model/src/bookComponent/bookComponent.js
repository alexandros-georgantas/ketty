/*
  TO DO

  Update division's "bookComponents" array of ids on insert.

  Read valid component type values from config and make it an enum
*/

const { Model } = require('objection')
const uuid = require('uuid/v4')

const Base = require('../editoriaBase')
const { model: Book } = require('../book')
const { model: Division } = require('../division')
const { boolean, id, integerPositive, string } = require('../helpers').schema

class BookComponent extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookComponent'
  }

  static get tableName() {
    return 'BookComponent'
  }

  static get relationMappings() {
    return {
      book: {
        relation: Model.BelongsToOneRelation,
        modelClass: Book,
        join: {
          from: 'BookComponent.bookId',
          to: 'Book.id',
        },
      },
      division: {
        relation: Model.BelongsToOneRelation,
        modelClass: Division,
        join: {
          from: 'BookComponent.divisionId',
          to: 'Division.id',
        },
      },
    }
  }

  static get schema() {
    return {
      type: 'object',
      required: ['bookId', 'componentType', 'divisionId'],
      properties: {
        bookId: id,
        /*
          component type (eg. 'chapter', 'part' etc) needs to be loose, as
          its accepted values are configurable
          OR read from config (doable?)
        */
        componentType: string,
        divisionId: id,
        pagination: {
          type: 'object',
          properties: {
            left: boolean,
            right: boolean,
          },
          default: {
            left: false,
            right: false,
          },
        },
        referenceId: id,

        /*
          counters
        */
        equationCounter: integerPositive,
        figureCounter: integerPositive,
        noteCounter: integerPositive,
        pageCounter: integerPositive,
        tableCounter: integerPositive,
        wordCounter: integerPositive,
      },
    }
  }

  /*
    If there is no reference id, assume it is a new component and generate one.
  */
  $beforeInsert() {
    super.$beforeInsert()
    this.referenceId = this.referenceId || uuid()
  }

  getBook() {
    return this.$relatedQuery('book')
  }

  getDivision() {
    return this.$relatedQuery('division')
  }
}

module.exports = BookComponent
