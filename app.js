const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
const routes = require('./routes/routes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let whitelist = ['https://nomobilemegamerger.com', 'http://localhost:8008'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
    callback(null, true)
    } else {
    const error = 'Not allowed by CORS, from this origin: ' + origin
    callback(new Error(error))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.options('*', cors());

routes(app);

const port = process.env.PORT || 8008;

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});
