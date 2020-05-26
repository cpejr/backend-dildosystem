
exports.up = function(knex) {
    return knex.schema.createTable('subproducts', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('description').nullable();
        table.boolean('visible').notNullable().defaultTo(false);
        table.integer('stock_quantity').notNullable();
        table.string('image_id').nullable();
        table.integer('product_id').notNullable();
        table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('subproducts');
};
