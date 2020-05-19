
exports.up = function(knex) {
  return knex.schema.createTable('orders', function (table){
    table.increments();
    table.integer('client_id').notNullable();
    table.foreign('client_id').references('id').inTable('clients').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('payment_type').nullable();
    table.enu('status', ['pending','paid','mailed']).notNullable();
  })
  .createTable('orders_products', function(table){
    table.integer('order_id').notNullable();
    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.integer('product_id').nullable();
    table.foreign('product_id').references('id').inTable('products').onDelete('SET NULL');
    table.integer('product_quantity').unsigned().notNullable();
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable('orders_products')
    .dropTable('orders');
};
