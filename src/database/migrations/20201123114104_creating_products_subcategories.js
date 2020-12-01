exports.up = function(knex) {
  return knex.schema.createTable('products_subcategories', function(table){
    table.string('product_id').notNullable();
    table.foreign('product_id').references('id').inTable('products');
    table.string('subcategory_id').notNullable();
    table.foreign('subcategory_id').references('id').inTable('subcategories').onDelete('CASCADE');
    table.primary(['product_id', 'subcategory_id']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('products_subcategories')
};
