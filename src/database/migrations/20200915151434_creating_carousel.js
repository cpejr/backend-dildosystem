
exports.up = function (knex) {
    return knex.schema.createTable('carousel', function (table) {
        table.string('id').primary().notNullable();
        table.string('image_id').notNullable();
        table.integer('position').notNullable();
	});
};

exports.down = function(knex) {
    return knex.schema.dropTable('carousel');
};


