exports.up = function (knex) {
  return knex.schema.createTable('categories', function (table) {
    table.increments();
    table.string('name').notNullable();
  })
    .createTable('subcategories', function (table) {
      table.increments();
      table.string('name').notNullable();
      table.integer('category_id').nullable();
      table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE');
    })
    .createTable('products', function (table) {
      table.increments();
      table.string('name').notNullable();
      table.float('client_price').notNullable();
      table.float('client_sale_price').nullable();
      table.float('wholesaler_price').notNullable();
      table.float('wholesaler_sale_price').nullable();
      table.boolean('on_sale_client').notNullable().defaultTo(false);
      table.boolean('on_sale_wholesaler').nullable().defaultTo(false);
      table.boolean('featured').notNullable().defaultTo(false);
      table.string('description').nullable();
      table.boolean('visible').notNullable().defaultTo(false);
      table.integer('stock_quantity').notNullable().defaultTo(0).unsigned();
      table.integer('min_stock').notNullable().defaultTo(0).unsigned();
      table.string('image_id').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.integer('subcategory_id').nullable().defaultTo(0).unsigned();
      table.foreign('subcategory_id').references('id').inTable('subcategories').onDelete('SET NULL');
    })  
};

exports.down = function (knex) {
  return knex.schema.dropTable('products')
    .dropTable('subcategories')
    .dropTable('categories');
};

