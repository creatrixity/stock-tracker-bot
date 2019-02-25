'use strict';

const fetch = require('node-fetch');
const { INTRINIO_API_KEY } = process.env;

/**
 * Retrieves the stock price for a publicly traded company.
 * 
 * @param {String} priceType 
 * @param {String} companyName 
 * @param {String} date 
 * @param {Function} cloudFNResponse 
 * 
 * @returns {Promise}
 */
function getStockPrice (priceType, companyName, date, cloudFNResponse, action) {
  if (action === 'input.getStockPrice') return;

  // Dictionary mapping company name to stock ticker.
  const tickerMap = {
    apple: 'AAPL',
    google: 'GOOG',
    tesla: 'TESL',
    ibm: 'IBM',
    microsoft: 'MSFT',
    snapchat: 'SNAP',
    facebook: 'FB'
  };

  // Dict mapping price type to API specific price term.
  const priceTypeMap = {
    opening: 'open_price',
    closing: 'close_price',
    high: 'high_price',
    low: 'low_price',
    maximum: 'high_price',
    minimum: 'low_price',
    min: 'low_price',
    max: 'high_price',
  };

  // Carry out the actual mapping.
  const stockTicker = tickerMap[companyName.toLowerCase()];
  const stockPriceType = priceTypeMap[priceType.toLowerCase()];
  const requestDate = date.split('T')[0];

  console.log('Stock ticker is', stockTicker);
  console.log('Stock price type is', stockPriceType);

  const hostURL = 'https://api.intrinio.com';
  let requestURL = `${hostURL}/historical_data?identifier=${stockTicker}&item=${stockPriceType}`
  requestURL += `&start_date=${requestDate}&end_date=${requestDate}&api_key=${INTRINIO_API_KEY}`

  return fetch(requestURL)
    .then(res => res.json())
    .then(parsedData => {
      if (!parsedData.data.length) {
        return cloudFNResponse.send({ fulfillmentText: 'Sorry, I could not find any suitable results.'});
      }

      let stockValue = parsedData.data[0].value;

      const msg = `The ${priceType} price for ${companyName} on ${date} was $${stockValue}`;

      return cloudFNResponse.send({
        fulfillmentText: msg,
        fulfillmentMessages: [{
          "card": {
            "title": `Great! Here's financial information about ${companyName}.`,
            "subtitle": msg,
            "imageUri": `https://logo.clearbit.com/${companyName.toLowerCase()}.com`,
            "buttons": [
              {
                "text": `See more about ${companyName}`,
                "postback": `https://${companyName.toLowerCase()}.com/`
              }
            ]
          }
        }] 
      });  
    });
};

module.exports = { getStockPrice };