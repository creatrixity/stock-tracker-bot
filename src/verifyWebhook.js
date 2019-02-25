'use strict';

const { WEBHOOK_VERIFICATION_TOKEN } = process.env;

const verifyWebhook = (req, res) => {
  const challenge = req.query['hub.challenge'];
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];

  if (mode && token === WEBHOOK_VERIFICATION_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

module.exports = verifyWebhook;