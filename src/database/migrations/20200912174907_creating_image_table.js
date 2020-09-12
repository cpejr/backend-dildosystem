
exports.up = function(knex) {
    return knex.schema.createTable('images', function (table) {
        table.string("id").primary().notNullable();
        table.integer("index").notNullable();
        table.integer('product_id').references('id').inTable('products').onDelete('SET NULL').nullable();
        table.integer('subproduct_id').references('id').inTable('subproducts').onDelete('SET NULL').nullable();
	})
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('images');
};
