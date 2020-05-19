
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
    })
    .table('products', function (table) {   
        table.renameColumn('wholesailer_price', 'wholesaler_price');
        table.renameColumn('wholesailer_sale_price', 'wholesaler_sale_price');
        table.dropColumn('stock_quantity');    
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('subproducts')
    .table('products', function (table) {   
        table.renameColumn('wholesaler_price', 'wholesailer_price');
        table.renameColumn('wholesaler_sale_price', 'wholesailer_sale_price');
        table.int('stock_quantity').notNullable().defaultTo(0);
    });
};
