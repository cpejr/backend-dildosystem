
exports.up = function (knex) {
    return knex.schema.createTable('carocel', function (table) {
        table.increments();
        table.string('image_id').notNullable();
        table.integer('position').notNullable();
	});
};

exports.down = function(knex) {
    return knex.schema.dropTable('carocel');
};


