'use strict';

const dialogFlow = require('dialogflow');
const fetch = require('node-fetch');

const languageCode = 'en-US';
const projectID = 'stocktracker-bd454';
const sessionID = '123456';

const {
  DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_CLIENT_EMAIL,
  FACEBOOK_ACCESS_TOKEN
} = process.env;

const config = {
  credentials: {
    private_key: DIALOGFLOW_PRIVATE_KEY,
    client_email: DIALOGFLOW_CLIENT_EMAIL
  }
};

const sessionClient = new dialogFlow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectID, sessionID);
const messageClientPath = 'https://graph.facebook.com/v2.6/me/messages';

const sendTextMessage = (userID, text) => {
  return fetch(`${messageClientPath}/?access_token=${FACEBOOK_ACCESS_TOKEN}`, {
    headers: {
      'Content-Type': 'application/json'
    },

    method: 'POST',

    body: JSON.stringify({
      messaging_type: 'response',
      recipient: {
        id: userID
      },

      message: {
        text,
      }
    })
  });
};

const initMessageProcessing = (event) => {
  const {
    sender,
    message
  } = event;

  const senderID = sender.id;
  const messageText = message.text;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        languageCode,
        text: messageText,
      }
    }
  };

  sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      return sendTextMessage(senderID, result.fulfillmentText)
    }).catch(err => {
      console.log('Error:', err);
    });
}

module.exports = initMessageProcessing;