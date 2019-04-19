const validator = require('validator');
const { send } = require('micro');
const { router, get } = require('microrouter');
const { renderImage } = require('./render');
const { PRESETS } = require('./constants');

const urlValidatorOptions = {
  require_tld: true,
  require_protocol: true,
  allow_protocol_relative_urls: true,
};

const error = (code = 404, message = 'Not Found') => (req, res) => {
  return send(res, code, message);
};

const configureImage = options => async (req, res) => {
  res.setHeader('Content-Type', 'image/jpeg');
  const composerUrl = process.env.COMPOSER_URL || `https://${req.headers.host}`;
  const image = await renderImage(composerUrl, options);
  return send(res, 200, image);
};

async function renderer(req, res) {
  const preset = req.params.preset || '';
  const imageUrl = req.query.imageUrl || '';
  const isValidUrl = validator.isURL(imageUrl, urlValidatorOptions);
  const image = configureImage({ preset, ...req.query });

  if (Object.keys(PRESETS).includes(preset) || isValidUrl) {
    return image(req, res);
  }

  return error(400, 'Invalid URL')(req, res);
}

module.exports = router(get('/r/:preset', renderer), get('/*', error()));
