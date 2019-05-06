const { send } = require('micro');
const { router, get } = require('microrouter');
const { isValidUrl } = require('../utils');
const { renderImage } = require('./render');

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
  const presetUrl = req.query.presetUrl || '';

  if (isValidUrl(presetUrl)) {
    const image = configureImage({ preset, ...req.query });
    return image(req, res);
  }

  return error(400, 'Invalid URL')(req, res);
}

module.exports = router(get('/r/:preset', renderer), get('/*', error()));
