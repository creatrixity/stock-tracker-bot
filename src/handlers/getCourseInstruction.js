const fetch = require('node-fetch');
const {
  YOUTUBE_CHANNEL_ID,
  YOUTUBE_API_KEY
} = process.env;

function getCourseInstruction (course, cloudFNResponse){
  const queryHost = 'https://www.googleapis.com/youtube/v3/search';
  const queryString = course.trim().replace(/\s+/, '+');
  const queryRequestURL = `${queryHost}?channelId=${YOUTUBE_CHANNEL_ID}&q=${queryString}&type=video&part=snippet&key=${YOUTUBE_API_KEY}`;

  return fetch(queryRequestURL)
    .then(res => res.json())
    .then(parsedData => {
      const { items } = parsedData;
      
      if (!items.length) {
        return cloudFNResponse.send({
          fulfillmentText:  `Sorry, I could not find any resources for ${course}. A thousand apologies!`
        });
      }
      
      const messages = items.map(item => {
        const {
          snippet,
          id
        } = item;

        const {
          description,
          thumbnails,
          title
        } = snippet;

        return {
          card: {
            title,
            "subtitle": description,
            "imageUri": thumbnails.default.url,
            "buttons": [
              {
                "text": `See this resource`,
                "postback": `https://youtube.com/watch?v=${id.videoId}`
              }
            ]
          }
        }
      });

      return cloudFNResponse.send({
        fulfillmentText: `We found ${items.length} resource${items.length > 1 && 's'}.`,
        fulfillmentMessages: messages
      });
    });
}

module.exports = { getCourseInstruction };