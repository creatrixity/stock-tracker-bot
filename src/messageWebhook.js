'use strict';

const processMessage = require('./processMessage');

const messageWebhook = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          processMessage(event);
        }
      })
    });

    res.status(200).end();
  }
};

module.exports = messageWebhook;