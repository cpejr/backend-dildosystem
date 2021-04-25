
exports.up = function (knex) {
  return knex.schema.createTable('testAWS', function (table) {
    table.string('id').primary().notNullable();
    table.string('name').notNullable();
    table.float('client_price').notNullable();
    table.text('description').nullable();
    table.string('image_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })

};

exports.down = function (knex) {
  return knex.schema.dropTable('testAWS')
};
