require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errors } = require('celebrate');
require('./models/GoogleDriveModel').config();
const bodyParser = require('body-parser');



const port = process.env.PORT || 3333;

const app = express();

const corsOptions = {
  exposedHeaders: 'X-Total-Count',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use(errors());

app.listen(port, () => {
  console.log("Listening on port: " + port);
});