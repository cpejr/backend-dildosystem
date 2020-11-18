
exports.up = function (knex) {
  return knex.schema.table('orders', function (table) {
    table.float('total_price').notNullable().defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.table('orders', function (table) {
    table.dropColumn('total_price');
  });
};
