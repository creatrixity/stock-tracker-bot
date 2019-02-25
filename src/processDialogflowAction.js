'use strict';

const { getCourseInstruction } = require('./handlers/getCourseInstruction');
const { getStockPrice } = require('./handlers/getStockPrice');

/**
 * Processes all dialog flow actions coming into the webhook.
 * 
 * @param {Object} request
 * @param {Object} response
 * 
 * @returns {Object<response>|Function}
 */
const processDialogflowAction = (request, response) => {
  const requestBody = request.body;
  const { queryResult } = requestBody;
  const { action, parameters } = queryResult;

  console.log(action);

  // Set response headers.
  response.setHeader('Content-Type', 'application/json');

  // Extract parameters from the query.
  const {
    company_name,
    date,
    price_type,
    course
  } = parameters;

  const actionsMap = {
    'input.getStockPrice': {
      handler: getStockPrice,
      arguments: [price_type, company_name, date, response, action]
    },
    'input.getCourseInstruction': {
      handler: getCourseInstruction,
      arguments: [course, response, action]
    }
  }

  if (!actionsMap[action]) {
    return response.send('Sorry, I had a little trouble with your question.');
  }

  const actionObject = actionsMap[action];

  return actionObject.handler.apply(this, actionObject.arguments);
};


module.exports = processDialogflowAction;