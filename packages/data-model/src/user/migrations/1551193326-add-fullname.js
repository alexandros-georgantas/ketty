exports.up = async knex =>
  knex.schema.table('users', table => {
    table.string('fullname')
  })
