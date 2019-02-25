const bodyParser = require('body-parser');
const env = require('dotenv');
const express = require('express');
const app = express();

env.config({ path: 'variables.env' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', require('./verifyWebhook'));

app.post('/', require('./processDialogflowAction'));

app.listen(5000, () => console.log('Express server is listening on port 5000'))
