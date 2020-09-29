
exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.string('id').primary().notNullable();
        table.string('name').notNullable();
        table.string('firebase').notNullable();
        table.string('email').notNullable();
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
        table.enu('user_status', ['pending', 'approved', 'refused']).notNullable().defaultTo('pending');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
