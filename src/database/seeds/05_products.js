
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {
          "id": "docim",
          "name": "doce",
          "client_price": 4,
          "client_sale_price": 3,
          "on_sale_client": 1,
          "featured": 0,
          "description": "um doce muito gostoso",
          "visible": 1,
          "stock_quantity": 300,
          "min_stock": 7,
          "image_id": "1SlCr7HIldc0stbxu_7sijGdE6q0CoasK",
          "subcategory_id": "haushuahsuahusuhashus",
          "weight": 1,
          "height": 1,
          "width": 1,
          "length": 1,
          "wholesaler_price": 3,
          "wholesaler_sale_price": 2,
          "on_sale_wholesaler": 1
        },
        {
          "id": "docim2",
          "name": "doce",
          "client_price": 4,
          "client_sale_price": 3,
          "on_sale_client": 1,
          "featured": 0,
          "description": "um doce muito gostoso",
          "visible": 0,
          "stock_quantity": 300,
          "min_stock": 5,
          "image_id": "1_PGas1PCM5v4mdKOkAgts1TwYP7GVUlR",
          "subcategory_id": "haushuahsuahusuhashus",
          "weight": 1,
          "height": 1,
          "width": 1,
          "length": 1,
          "wholesaler_price": 3,
          "wholesaler_sale_price": 2,
          "on_sale_wholesaler": 0
        }
      ]);
    }); 
};