
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {
          "id": "2731ad60-22ee-11eb-8cbc-d1e65e7dd5b2",
          "name": "Super Egg",
          "client_price": 10,
          "client_sale_price": 9,
          "on_sale_client": false,
          "wholesaler_price": 9,
          "wholesaler_sale_price": 8,
          "on_sale_wholesaler": true,
          "best_seller": true,
          "release": false,
          "description": "Não é apenas um ovo, é um SUPER ovo",
          "visible": true,
          "stock_quantity": 50,
          "min_stock": 20,
          "image_id": "1tBfe6CrL-qcNLoyX5-i9nMVCtFXVCyRC",
          "subcategory_id": "91c45040-22e1-11eb-8d75-214996dae135",
          "weight": 3,
          "height": 50,
          "width": 50,
          "length": 50
        }
      ]);
    });
};