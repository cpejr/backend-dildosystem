require('dotenv').config();

const nodemailer = require("nodemailer");
const nodemailerExpressHandlebars = require('nodemailer-express-handlebars');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve(__dirname, "views"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "views"),
  extName: ".handlebars",
};

transporter.use('compile', hbs(handlebarOptions));

module.exports = {
  async sendEmail(data) {
    const config = {
      from: `Loja Casulus <${process.env.EMAIL_LOGIN}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      template: 'register',
      attachments: [{
        filename: 'CASULUS00LOGO.png',
        path: path.join(__dirname, '/images/CASULUS00LOGO.png'),
        cid: 'logoCasulus'
      },
      {
        filename: 'ladys-legs.jpg',
        path: path.join(__dirname, '/images/ladys-legs.jpg'),
        cid: 'testImage'
      },
      {
        filename: 'ladys-legs2.jpg',
        path: path.join(__dirname, '/images/ladys-legs2.jpg'),
        cid: 'testImage2'
      }
      ],

    };


    const mailSent = await transporter.sendMail(config, (err, info) => {
      if (err) {
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!!')
      }
    })

  },

  async resgisterMail(data) {
    const user_name = data.user_name
    const config = {
      from: `Loja Casulus <${process.env.EMAIL_LOGIN}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      template: 'register',
      attachments: [{
        filename: 'CASULUS00LOGO.png',
        path: path.join(__dirname, '/images/CASULUS00LOGO.png'),
        cid: 'logoCasulus'
      },
      {
        filename: 'ladys-legs.jpg',
        path: path.join(__dirname, '/images/ladys-legs.jpg'),
        cid: 'testImage'
      },
      {
        filename: 'ladys-legs2.jpg',
        path: path.join(__dirname, '/images/ladys-legs2.jpg'),
        cid: 'testImage2'
      },
      {
        filename: 'isnta-icon.jpg',
        path: path.join(__dirname, '/images/insta-icon.jpg'),
        cid: 'instaIcon'
      }],
      context: { user_name }
    };

    const mailSent = await transporter.sendMail(config, (err, info) => {
      if (err) {
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!! (Bem vindo cara usuário)')
      }
    })

  },

  async retailerAprovalMail(data) {
    const config = {
      from: `Loja Casulus <${process.env.EMAIL_LOGIN}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      template: 'retailerApproval',
      attachments: [{
        filename: 'CASULUS00LOGO.png',
        path: path.join(__dirname, '/images/CASULUS00LOGO.png'),
        cid: 'logoCasulus'
      },
      {
        filename: 'ladys-legs.jpg',
        path: path.join(__dirname, '/images/ladys-legs.jpg'),
        cid: 'testImage'
      },
      {
        filename: 'ladys-legs2.jpg',
        path: path.join(__dirname, '/images/ladys-legs2.jpg'),
        cid: 'testImage2'
      },
      {
        filename: 'isnta-icon.jpg',
        path: path.join(__dirname, '/images/insta-icon.jpg'),
        cid: 'instaIcon'
      }
      ]
    };

    const mailSent = await transporter.sendMail(config, (err, info) => {
      if (err) {
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!! (Aprovado como varejista)')
      }
    })
  },

  async orderReceiviedMail(data) {
    const user_name = data.user_name
    const order_number = data.order_number
    const products = data.produtos.products
    const { zipcode, state, city, neighborhood, street, number, complement } = data.produtos
    console.log(data)
    
    const config = {
      from: `Loja Casulus <${process.env.EMAIL_LOGIN}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      template: 'orderReceived',
      attachments: [{
        filename: 'CASULUS00LOGO.png',
        path: path.join(__dirname, '/images/CASULUS00LOGO.png'),
        cid: 'logoCasulus'
      },
      {
        filename: 'isnta-icon.jpg',
        path: path.join(__dirname, '/images/insta-icon.jpg'),
        cid: 'instaIcon'
      }],
      context: { user_name, order_number, products, zipcode, state, city, neighborhood, street, number, complement }
    };

    const mailSent = await transporter.sendMail(config, (err, info) => {
      if (err) {
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!! (seu pedido foi created)')
      }
    })

  },

  async orderStatusMail(data) {

    let order_status = 'Entregue a transportadora.'

    if (data.order_status === 'paid') {
      order_status = 'Pago.'
    }
    else if (data.order_status === 'pending') {
      order_status = 'Aguardando aprovação.'
    }
    else if (data.order_status === 'mailed') {
      order_status = 'Entregue a transportadora.'
    }
    else if (data.order_status === 'delivered') {
      order_status = 'O seu pedido chegou!'
    }
    else if (data.order_status === 'cancelled') {
      order_status = 'O seu pedido foi cancelado. Entre em contato para mais informações.'
    }
    else {
      //console.log(data.order_status)
      order_status = 'Em andamento.'
    }


    const config = {
      from: `Loja Casulus <${process.env.EMAIL_LOGIN}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      template: 'orderStatus',
      attachments: [{
        filename: 'CASULUS00LOGO.png',
        path: path.join(__dirname, '/images/CASULUS00LOGO.png'),
        cid: 'logoCasulus'
      },
      {
        filename: 'isnta-icon.jpg',
        path: path.join(__dirname, '/images/insta-icon.jpg'),
        cid: 'instaIcon'
      }],
      context: { order_status }
    };

    const mailSent = await transporter.sendMail(config, (err, info) => {
      if (err) {
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!! (atualizando teu pedido)')
      }
    })
  }

}