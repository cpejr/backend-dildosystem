
exports.up = function(knex) {
  return knex.schema.table('orders_products', function (table) {
    table.float('price').notNullable().defaultTo(1);
});
};

exports.down = function(knex) {
  return knex.schema.table('orders_products', function (table) {
    table.dropColumn('price');
});
};
