require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errors } = require('celebrate');
const port = process.env.PORT || 3333;

const app = express();

const corsOptions = {
  exposedHeaders: 'X-Total-Count',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);
app.use(errors());

app.listen(port, ()=>{
  console.log("Listening on port: " + port);
});