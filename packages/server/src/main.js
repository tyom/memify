import { send } from 'micro';
import { router, get } from 'microrouter';
import { renderImage } from './render';

const error = (code = 404, message = 'Not Found') => (req, res) => {
  return send(res, code, message);
};

const configureImage = (memeId, query) => async (req, res) => {
  res.setHeader('Content-Type', 'image/jpeg');
  const composerUrl = process.env.COMPOSER_URL || `https://${req.headers.host}`;
  const image = await renderImage(composerUrl, { memeId, query });
  return send(res, 200, image);
};

async function renderMeme(req, res) {
  const { memeId } = req.params;
  if (!memeId) {
    return error(400, 'Invalid URL: Meme ID is required')(req, res);
  }
  if (memeId === 'snapshot') {
    if (!req.query.d) {
      return error(400, '`d` query param is missing')(req, res);
    }
  }
  const image = configureImage(memeId, req.query);
  return image(req, res);
}

export default router(
  get('/r/:memeId', renderMeme),
  get('/*', error('Invalid URL'))
);
