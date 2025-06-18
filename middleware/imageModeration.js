// importing axios for https requests
const axios = require('axios');

async function moderateImage(imageBuffer) {
  //convertingthe image to string
  const imageBase64 = imageBuffer.toString('base64');

  try {
    //posting the image with checks
    const response = await axios.post('https://api.sightengine.com/1.0/check.json', null, {
      params: {
        'models': 'nudity,wad,offensive',
        'api_user': process.env.SIGHTENGINE_USER,
        'api_secret': process.env.SIGHTENGINE_SECRET,
        'media': `data:image/jpeg;base64,${imageBase64}`
      }
    });
   
    //gets the results
    const result = response.data;

    // setting values for moderation
    if (result.nudity.safe < 0.85 || result.weapon > 0.5 || result.offensive.prob > 0.5) {
      return { allowed: false, reason: 'Image flagged as inappropriate' };
    }

    return { allowed: true };
  } catch (err) {
    console.error('Moderation error:', err.response?.data || err.message);
    return { allowed: false, reason: 'Moderation service failed' };
  }
}

module.exports = moderateImage;
