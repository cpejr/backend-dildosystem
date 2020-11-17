
exports.up = function (knex) {
  return knex.schema.createTable('mock_orders', function (table) {
    table.string('order_id').primary().notNullable();
    table.string('payment_type').notNullable();
    table.string('track_type').notNullable();
    table.float('track_price').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('mock_orders');
};
