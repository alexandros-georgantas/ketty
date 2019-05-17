/*
  An extension of pubsweet's base model with some bells and whistles.
  All other Editoria models will (and should) extend this class.
*/

const BaseModel = require('@pubsweet/base-model')
const each = require('lodash/each')

class EditoriaBase extends BaseModel {
  $beforeInsert() {
    super.$beforeInsert()
    this.deleted = false
  }

  // $parseDatabaseJson(json) {
  //   json = super.$parseDatabaseJson(json)
  //   // console.log('constu', this.constructor.jsonSchema)
  //   each(this.constructor.jsonSchema.properties, (schema, prop) => {
  //     if (schema.format === 'date') {
  //       console.log('in if', json[prop])
  //       json[prop] = json[prop] && new Date(json[prop])
  //       console.log('in if after', json[prop])
  //     }
  //   })
  //   return json
  // }

  static get schema() {
    return {
      type: 'object',
      properties: {
        deleted: {
          type: 'boolean',
          default: false,
        },
      },
    }
  }

  static async findById(id) {
    return this.find(id)
  }
}

module.exports = EditoriaBase
