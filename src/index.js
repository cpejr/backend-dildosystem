require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { errors, isCelebrate } = require('celebrate');
const bodyParser = require('body-parser');
const {ToadScheduler} = require('toad-scheduler')

const routes = require('./routes');
const {instaUpdateJob} = require('./schedule/instaSchedule');


const port = process.env.PORT || 3333;

const scheduler = new ToadScheduler();
scheduler.addSimpleIntervalJob(instaUpdateJob);

const app = express();

const corsOptions = {
  exposedHeaders: 'X-Total-Count',
};

const errorHandler = (err, req, res, next) => {
  if (isCelebrate(err)) {
    console.log(err.joi.message)
  }
  return errors()(err, req, res, next);
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Listening on port: " + port);
});