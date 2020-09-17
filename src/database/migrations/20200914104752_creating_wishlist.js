
exports.up = function(knex) {
    return knex.schema.createTable('wishlist', function (table) {
        table.increments();
        table.integer('user_id').nullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('product_id').notNullable();
        table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('wishlist');
};
