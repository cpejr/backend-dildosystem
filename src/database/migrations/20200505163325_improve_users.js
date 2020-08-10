
exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('firebase').notNullable();
        table.enu('type', ['admin','retailer','wholesaler']).notNullable();
        table.string('cpf').notNullable();
        table.string('birthdate');
        table.string('zipcode');
        table.string('phonenumber');
        table.string('state');
        table.string('city');
        table.string('neighborhood');
        table.string('street');
        table.string('number');
        table.string('complement');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.boolean('approved').defaultTo(false).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
