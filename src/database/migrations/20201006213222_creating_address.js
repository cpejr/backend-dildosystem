
exports.up = function (knex) {
    return knex.schema.createTable('address', function (table) {
        table.string('id').primary().notNullable();
        table.string('zipcode');
        table.string('state');
        table.string('city');
        table.string('neighborhood');
        table.string('street');
        table.string('number');
        table.string('complement');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('users_address', function (table) {
        table.string('id').primary().notNullable();
        table.string('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('address_id').nullable();
        table.foreign('address_id').references('id').inTable('address');
        
      });
};

exports.down = function (knex) {
    return knex.schema
    .dropTable('address')
    .dropTable('users_address');
};
