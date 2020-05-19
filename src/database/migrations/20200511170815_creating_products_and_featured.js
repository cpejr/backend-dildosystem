
exports.up = function (knex) {
  return knex.schema.createTable('products', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.float('client_price').notNullable();
    table.float('client_sale_price').nullable();
    table.float('wholesailer_price').notNullable();
    table.float('wholesailer_sale_price').nullable();
    table.boolean('on_sale_client').notNullable().defaultTo(false);
    table.boolean('on_sale_wholesaler').nullable().defaultTo(false);
    table.boolean('featured').notNullable().defaultTo(false);
    table.string('description').nullable();
    table.boolean('visible').notNullable().defaultTo(false);
    table.int('stock_quantity').notNullable();
    table.string('image_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('products');
};

