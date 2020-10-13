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
        filename: 'logoCasulus.png',
        path: path.join(__dirname, '/images/logoCasulus.png'),
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
      if(err){
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!!')
      }
    })
    
  },

  async resgisterMail(data) {
    const config = {
      from: `Loja Casulus <${process.env.EMAIL_LOGIN}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      template: 'register',
      attachments: [{
        filename: 'logoCasulus.png',
        path: path.join(__dirname, '/images/logoCasulus.png'),
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
      if(err){
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!!')
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
        filename: 'logoCasulus.png',
        path: path.join(__dirname, '/images/logoCasulus.png'),
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
      if(err){
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!!')
      }
    })
  },

  async orderReceiviedMail(data) {
    const config = {
      from: `Loja Casulus <${process.env.EMAIL_LOGIN}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      template: 'orderReceived',
      attachments: [{
        filename: 'logoCasulus.png',
        path: path.join(__dirname, '/images/logoCasulus.png'),
        cid: 'logoCasulus'
      },
      {
        filename: 'isnta-icon.jpg',
        path: path.join(__dirname, '/images/insta-icon.jpg'),
        cid: 'instaIcon'
      }],};
   
    const mailSent = await transporter.sendMail(config, (err, info) => {
      if(err){
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!!')
      }
    })
    
  },

  async orderStatusMail(data) {

    let order_status = 'Entregue a transportadora.'

    if(data.order_status === 'paid'){
      order_status = 'Pago.'
    }
    if(data.order_status === 'pending'){
      order_status = 'Aguardando aprovação.'
    }
    if(data.order_status === 'mailed'){
      order_status = 'Entregue a transportadora.'
    }
    if(data.order_status === 'delivered'){
      order_status = 'O seu pedido chegou!'
    }
    else {
      order_status = 'Em andamento.'
    }
    

    const config = {
      from: `Loja Casulus <${process.env.EMAIL_LOGIN}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      template: 'orderStatus',
      attachments: [{
        filename: 'logoCasulus.png',
        path: path.join(__dirname, '/images/logoCasulus.png'),
        cid: 'logoCasulus'
      },
      {
        filename: 'isnta-icon.jpg',
        path: path.join(__dirname, '/images/insta-icon.jpg'),
        cid: 'instaIcon'
      }],
      context: { order_status }};
   
    const mailSent = await transporter.sendMail(config, (err, info) => {
      if(err){
        console.log('Error: ', err)
      }
      else {
        console.log('Message sent!!!')
      }
    })
  }

}