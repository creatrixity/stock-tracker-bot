'use strict';
const VERIFY_TOKEN='stock-tracker-bot';

const verifyWebhook = (req, res) => {
  const challenge = req.query['hub.mode'];
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

module.exports = verifyWebhook;