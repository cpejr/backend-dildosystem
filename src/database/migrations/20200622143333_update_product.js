
exports.up = function (knex) {
	return knex.schema.table('products', function (table) {
		table.float('weight').notNullable().defaultTo(1);
		table.float('height').notNullable().defaultTo(1);
		table.float('width').notNullable().defaultTo(1);
		table.float('length').notNullable().defaultTo(1);
	});
};

exports.down = function (knex) {
	return knex.schema.table('products', function (table) {
		table.dropColumn('weight');
		table.dropColumn('height');
		table.dropColumn('width');
		table.dropColumn('length');
	});
};
