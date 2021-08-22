
exports.up = function (knex) {
  return knex.schema.createTable('credentials', function (table) {
    table.string('access_token').notNullable();
    table.string('refresh_token').notNullable();
    table.string('scope').notNullable();
    table.string('token_type').notNullable();
    table.string('expiry_date').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('credentials');
};
