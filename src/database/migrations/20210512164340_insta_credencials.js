
exports.up = function(knex) {
  return knex.schema.createTable('insta_credentials', function (table) {
    table.string('access_token').notNullable();
    table.biginteger('expiry_date').notNullable();
  });
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('insta_credentials');
};
