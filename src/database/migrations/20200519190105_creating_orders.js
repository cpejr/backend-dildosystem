
exports.up = function (knex) {
  return knex.schema.createTable('orders', function (table) {
    table.string('id').primary().notNullable();
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.integer('address_id').notNullable();
    table.foreign('address_id').references('id').inTable('address').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('payment_type').nullable();
    table.enu('order_status', ['pending', 'paid', 'mailed','delivered']).notNullable().defaultTo('pending');
    table.string('track_number').nullable();
    table.integer('track_price').notNullable();
    table.string('track_type').notNullable();
  })
    .createTable('orders_products', function (table) {
      table.string('id').primary().notNullable();
      table.string('order_id').notNullable();
      table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
      table.string('product_id').nullable();
      table.foreign('product_id').references('id').inTable('products');
      table.integer('product_quantity').unsigned().notNullable();
      table.string('subproduct_id').nullable();
      table.foreign('subproduct_id').references('id').inTable('subproducts');
      table.float('price').notNullable().defaultTo(1);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('orders_products')
    .dropTable('orders');
};
