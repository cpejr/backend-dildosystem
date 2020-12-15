
exports.up = function(knex) {
    return knex.schema.table('orders', function (table) {
		table.integer('delivery_time').notNullable().defaultTo(1);
    })
    .table('mock_orders', function (table) {
		table.integer('delivery_time').notNullable().defaultTo(1);
	});
};

exports.down = function(knex) {
    return knex.schema.table('orders', function (table) {
		table.dropColumn('delivery_time');
    })
    .table('mock_orders', function (table) {
		table.dropColumn('delivery_time');
	})
};
