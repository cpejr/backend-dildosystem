
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('credentials').del()
    .then(function () {
      // Inserts seed entries
      return knex('credentials').insert([
        
            {
              "access_token" : "ya29.a0AfH6SMC70MsDo4IkTK97vZi3TdV66CCAykq70mycxoNle6QH9O9jjDaa-phigc-75xg_YUUuR-gyC3uaP6ZJfOV8FiMa6tqocSCrSWhekZuIjextJgJYoM9qIalESHWmDvZtIcexfj68P4-jxB3EcD61fyej48wJG5c",
              "refresh_token" : "1\/\/0heeHs4QZVYgACgYIARAAGBESNwF-L9IrWZfxTC8yMg3yKDz1Jr8PJXTQRHu6KRx3-yQSbpYvgDkJrhUVrJ0mlZZAKa8TUXU4rJ4",
              "scope" : "https:\/\/www.googleapis.com\/auth\/drive",
              "token_type" : "Bearer",
              "expiry_date" : 1598924145866
            }  
      ]);
    }); 
};