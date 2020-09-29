
exports.up = function(knex) {
    return knex.schema.createTable('wishlist', function (table) {
        table.string('id').primary().notNullable();
        table.string('user_id').nullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('product_id').notNullable();
        table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('wishlist');
};
