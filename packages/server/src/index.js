const { send } = require('micro');
const { router, get } = require('microrouter');
const qs = require('querystring');
const btoa = require('btoa');
const atob = require('atob');
const { isValidUrl } = require('@memify/lib');
const { renderImage } = require('./render');

const error = (code = 404, message = 'Not Found') => (req, res) => {
  return send(res, code, message);
};

function isBase64(str = '') {
  if (str.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

const configureImage = options => async (req, res) => {
  res.setHeader('Content-Type', 'image/jpeg');
  const composerUrl = process.env.COMPOSER_URL || `https://${req.headers.host}`;
  const image = await renderImage(composerUrl, options);
  return send(res, 200, image);
};

async function renderer(req, res) {
  let { preset = '' } = req.params;
  let { text, presetUrl } = req.query;

  if (isBase64(preset)) {
    const [decodedPreset, decodedQueryString] = atob(preset).split('?');
    const query = qs.parse(decodedQueryString);
    preset = decodedPreset;
    presetUrl = query.presetUrl;
    text = query.text;
  }

  if (isValidUrl(presetUrl)) {
    const image = configureImage({ preset, presetUrl, text, ...req.query });
    return image(req, res);
  }

  return error(400, 'Invalid URL')(req, res);
}

module.exports = router(get('/r/:preset', renderer), get('/*', error()));
