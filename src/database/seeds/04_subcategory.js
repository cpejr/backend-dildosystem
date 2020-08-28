exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('subcategories').del()
    .then(function () {
      // Inserts seed entries
      return knex('subcategories').insert([
        {
          name: "sub-generica",
          category_id: 1
        }
      ]);
    }); 
};