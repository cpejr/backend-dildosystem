const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/ProductModel");
const { v1: uuidv1 } = require('uuid');
const { getOne } = require("./UserController");
const { default: ShortUniqueId } = require('short-unique-id');

const Email = require('../mail/mail.js');
const { createMock } = require("../validators/OrderValidator");

const uid = new ShortUniqueId({
  dictionary: [
    '0', '1', '2', '3',
    '4', '5', '6', '7',
    '8', '9', 'A', 'B',
    'C', 'D', 'E', 'F',
  ],
});

module.exports = {

  async index(request, response) {
    try {
      const { page, byStatus, byid } = request.query;
      const { id } = request.params;
      let query = byStatus ? { order_status: byStatus } : {};
      const result = await OrderModel.getOrders(page, query, byid, id);

      response.setHeader("X-Total-Count", result.totalCount);
      return response.status(200).json(result.data);

    } catch (err) {
      console.error(err);

      return response.status(500).json({
        notification: "Internal server error while trying to get orders",
      });
    }
  },

  async getOne(request, response) {
    try {
      const requester = request.session.user;
      const { id } = request.params;
      const { order_id } = request.query;
      const result = await OrderModel.getOne(id, order_id, requester);

      response.status(200).json(result);
    }
    catch (err) {
      console.error(err);

      return response.status(500).json({
        notification: "Internal server error while trying to get one order",
      });
    }
  },

  async changeStatus(request, response) {
    try {
      //console.log(request.body);

      const { checkout_cielo_order_number, order_number, payment_status } = request.body;

      console.log('Received Cielo Notification on /cielonotification', request.body);

      let newPaymentStatus;

      if (payment_status === '2') {
        newPaymentStatus = 'paid';
      } else if (['3', '4', '5', '6', '8'].includes(payment_status)) {
        newPaymentStatus = 'cancelled';
      } else if (['1', '7'].includes(payment_status)) {
        newPaymentStatus = 'pending';
      }

      if (newPaymentStatus) {
        await OrderModel.updateOrder(order_number, { order_status: newPaymentStatus });
        const ord = await OrderModel.getOrders(1, {}, order_number);
        const data = {
          to: ord.data[0].user.email,
          subject: 'Bem Vindo',
          text: 'Loja Casulus',
          order_status: newPaymentStatus,
          products: ord,
          user_name: ord.data[0].user.name,
          id: ord.data[0].id
        }
        Email.orderStatusMail(data);
      }

      return response.status(200).json({ message: `Order with cielo checkout number ${checkout_cielo_order_number} was updated` });
    } catch (error) {
      //console.log(error);
      return response.status(500).json({ message: 'Internal server error while trying to change status' });
    }

  },

  async update(request, response) {
    try {
      const { id } = request.params;
      const fields = request.body;

      const result = await OrderModel.updateOrder(id, fields);

      const ord = await OrderModel.getOrders(1, {}, id);

      const data = {
        to: ord.data[0].user.email,
        subject: 'Bem Vindo',
        text: 'Loja Casulus',
        order_status: fields,
        products: ord,
        user_name: ord.data[0].user.name,
        id: ord.data[0].id
      }

      Email.orderStatusMail(data)
      // Email.orderReceiviedMail(data)

      return response.status(200).json(result.data);
    } catch (err) {
      console.error(err);
      return response.status(500).json({
        notification: "Internal server error while trying to update order",
      });
    }
  },

  async initialize(request, response) {
    try {
      const id = uid.randomUUID(10);

      return response.status(200).json(id);
    } catch (err) {
      console.error(err);
      return response.status(500).json({
        notification: "Internal server error while trying to initiate order",
      });
    }
  },

  async logCielo(request, response) {
    //console.log(request.body);
    return response.status(200).json({ message: 'Ok!' });
  },

  async createMock(request, response) {
    try {

      let { order_number, shipping_name, shipping_price, payment_method_type } = request.body;

      console.log('Received Cielo Notification on /cielo', request.body);

      const dashIndex = shipping_name.indexOf("-");
      // shipping_name = shipping_name.substring(0, dashIndex - 1);
      const words = shipping_name.split(" ");
      let name = "";
      let delivery_time;
      // words.forEach((element, index) => {
      //   if(element === "-"){
      //     delivery_time = Number(words[index + 2])
      //     break;
      //   } else {
      //     name += element;
      //   }
      // });
      for (let index = 0; index < words.length; index++) {
        const element = words[index];
        if (element === "-") {
          delivery_time = Number(words[index + 2])
          break;
        } else {
          name += element;
        }
      }

      shipping_name = name;

      let payment_type;

      switch (payment_method_type) {
        case '1':
          payment_type = "cartao_credito";
          break;
        case '2':
          payment_type = "boleto";
          break;
        case '3':
          payment_type = "debito_online";
          break;
        case '4':
          payment_type = "cartao_debito";
          break;
        case '5':
          payment_type = "QRcode";
          break;
        default:
          payment_type = "indefinido";
          break;
      }

      const mock = {
        order_id: order_number,
        payment_type,
        track_type: shipping_name,
        track_price: shipping_price / 100.0,
        delivery_time
      };

      console.log('mock to create', mock);

      await OrderModel.createMockOrder(mock);

      return response.status(200).json({ message: 'Ok!' });

    } catch (error) {
      //console.log(error)
      return response.status(500).json({
        notification:
          "Internal server error while trying to register the data of the ongoing new order",
      });
    }
  },

  async getMock(request, response) {
    try {
      const orderId = request.params.id;
      //const userId = request.session.user.id;

      const mockOrder = await OrderModel.getMockOrder(orderId);

      return response.status(200).json(mockOrder);
    } catch (error) {
      //console.log(error)
      return response.status(500).json({
        notification:
          "Internal server error while trying to get the data of the ongoing new order",
      });
    }
  },

  async create(request, response) {
    try {
      let { id, products, payment_type, track_type, track_price, address_id, delivery_time } = request.body;
      const user = request.session.user;
      //let id = uid.randomUUID(10);

      // console.log('esse eh o products: ', products)

      const order = {
        id: id,
        track_price: track_price,
        track_type: track_type,
        payment_type: payment_type,
        user_id: user.id,
        address_id: address_id,
        delivery_time: delivery_time
      };

      let products_id = [];
      let subproducts_id = [];
      let completesubproducts = [];

      products.forEach((value) => {
        if (value.subproduct_id) {
          subproducts_id.push(value.subproduct_id);
          completesubproducts.push({ product_id: value.product_id, subproduct_id: value.subproduct_id });

        }
        else products_id.push(value.product_id);
      });

      const stock = await ProductModel.getProductsQuantity(
        products_id,
        subproducts_id
      );
      let out_of_stock = [];
      let not_found = [];

      products.forEach((ordered) => {
        let found = false;

        if (ordered.subproduct_id)
          found = verify("subproduct_id", "subproduct_stock_quantity");
        else found = verify("product_id", "product_stock_quantity");

        if (!found) not_found.push(ordered);

        function verify(field_id, field_quantity) {
          for (let i = 0; i < stock.length; i++) {
            const stock_item = stock[i];

            if (stock_item[field_id] === ordered[field_id]) {
              if (stock_item[field_quantity] < ordered.product_quantity)
                out_of_stock.push(ordered);

              return true;
            }
          }
          return false;
        }
      });

      if (not_found.length > 0)
        return response.status(400).json({
          notification: "Some items were not found or are not available",
          items: not_found,
        });

      if (out_of_stock.length > 0)
        return response.status(400).json({
          notification: "Some of the items are out of stock",
          items: out_of_stock,
        });


      let prices = await ProductModel.getProductsPrices(
        products_id,
        ((user.type && user.user_status === 'approved') || 'retailer')
      );

      let total_price = track_price;

      products = products.map((value) => {
        const product = {
          id: uuidv1(),
          product_id: value.product_id,
          order_id: id,
          product_quantity: value.product_quantity,
          subproduct_id: value.subproduct_id,
          price: prices[value.product_id],
        };

        total_price += product.product_quantity * product.price;

        return product;
      });

      order.total_price = total_price;

      let order_id = await OrderModel.createNewOrder(order);

      await OrderModel.createProductOrder(products);

      const returnOrder = OrderModel.getOne(user.id, order_id);
      const deleteMock = OrderModel.deleteMockOrder(order_id);

      const promises = await Promise.all([returnOrder, deleteMock])

      response.status(200).json(promises[0]);

      const dataMail = {
        to: user.email,
        subject: 'Bem Vindo',
        text: 'Loja Casulus',
        order_number: id,
      }

      Email.orderReceiviedMail(dataMail);


    } catch (err) {
      if (err.errno === 19)
        return response.status(400).json({ notification: "Invalid ids" });

      console.warn(err);
      return response.status(500).json({
        notification:
          "Internal server error while trying to register the new order",
      });
    }
  },

  async delete(request, response) {
    try {
      const { order_id } = request.params;
      await OrderModel.deleteOrder(order_id);
      response.status(200).json({ message: "Deleted order: " + order_id });
    } catch (err) {
      console.warn(err);
      return response.status(500).json({
        notification: "Internal server error while trying to delete order",
      });
    }
  },

  async getOrderAddress(request, response) {
    try {

      const { id } = request.params;

      const result = await OrderModel.getOrderAddressAddress(id);

      return response.status(200).json(result);

    } catch (err) {
      console.error(err);
      return response.status(500).json({ notification: "Internal error while trying to get order address" })
    }
  },
};
